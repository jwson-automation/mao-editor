<template>
  <div class="editor-container">
    <!-- Hidden file input for import -->
    <input
      ref="fileInputRef"
      type="file"
      accept="application/json"
      style="display: none"
      @change="handleImportAll"
    >

    <!-- File list -->
    <TextEditorFileList
      v-if="fileList.length > 0 || document"
      :files="fileList"
      :current-file-id="currentFileId"
      @select-file="selectFile"
      @new-file="createNewFile"
      @delete-file="handleDelete"
      @rename-file="handleRename"
      @export-all="handleExportAll"
      @import-all="triggerImportAll"
    />

    <!-- Input mode: text input/paste with textarea -->
    <div v-if="!document" class="input-mode">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        class="text-input"
        :placeholder="t.inputPlaceholder"
        @paste="onPaste"
      />
      <button v-if="inputText" class="apply-btn" @click="applyText">{{ t.apply }}</button>
    </div>

    <!-- Edit mode: modify with textarea -->
    <div v-else-if="isEditMode" class="edit-mode">
      <textarea
        ref="editTextareaRef"
        v-model="editText"
        class="text-input"
        :placeholder="t.editPlaceholder"
      />
      <div class="edit-actions">
        <button class="cancel-btn" @click="cancelEdit">{{ t.cancel }}</button>
        <button class="apply-btn" @click="applyEdit">{{ t.apply }}</button>
      </div>
    </div>

    <!-- View mode: hide/reveal feature -->
    <div v-else class="editor-content" @mouseup="onMouseUp" @touchend="onTouchEnd">
      <div class="toolbar">
        <button class="toggle-visibility-btn" :title="t.toggleVisibility" @click="toggleShowAllHidden">
          <svg v-if="showAllHidden" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button class="edit-btn" @click="startEdit">{{ t.edit }}</button>
        <button class="save-btn" @click="handleSave">{{ t.save }}</button>
      </div>
      <div class="text-content">
        <TextEditorTextLine
          v-for="line in document.lines"
          :key="line.id"
          :line="line"
          :show-all-hidden="showAllHidden"
          @toggle-segment="toggleSegment"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { document, currentFileId, fileList, isEditMode, showAllHidden, handlePaste, toggleSegment, hideSelection, hideMultiSegmentSelection, loadSessionDocument, saveToFirestore, selectFile, createNewFile, deleteFile, renameFile, enterEditMode, exitEditMode, getPlainText, exportAllFiles, importAllFiles, toggleShowAllHidden } = useTextEditor()
const { t } = useI18n()

const inputText = ref('')
const editText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const editTextareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text/plain')
  if (text) {
    event.preventDefault()
    handlePaste(text)
  }
}

function applyText() {
  if (inputText.value.trim()) {
    handlePaste(inputText.value)
    inputText.value = ''
  }
}

async function handleSave() {
  const success = await saveToFirestore()
  if (success) {
    alert(t.value.saved)
  } else {
    alert(t.value.saveFailed)
  }
}

async function handleDelete(fileId: string) {
  if (confirm(t.value.deleteConfirm)) {
    const success = await deleteFile(fileId)
    if (!success) {
      alert(t.value.deleteFailed)
    }
  }
}

async function handleRename(fileId: string, newName: string) {
  const success = await renameFile(fileId, newName)
  if (!success) {
    alert(t.value.saveFailed)
  }
}

async function handleExportAll() {
  try {
    await exportAllFiles()
    alert(t.value.downloaded)
  } catch (error) {
    console.error('Export error:', error)
    alert(t.value.exportFailed)
  }
}

function triggerImportAll() {
  fileInputRef.value?.click()
}

async function handleImportAll(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data)) {
      alert(t.value.invalidFormat)
      return
    }

    const count = await importAllFiles(data)
    alert(t.value.imported(count))

    input.value = ''
  } catch (error) {
    console.error('Import error:', error)
    alert(t.value.importFailed)
  }
}

function startEdit() {
  editText.value = getPlainText()
  enterEditMode()
  nextTick(() => {
    editTextareaRef.value?.focus()
  })
}

function cancelEdit() {
  isEditMode.value = false
  editText.value = ''
}

function applyEdit() {
  if (editText.value.trim()) {
    exitEditMode(editText.value)
    editText.value = ''
  }
}

function handleSelectionHide() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return

  const range = selection.getRangeAt(0)
  const startContainer = range.startContainer
  const endContainer = range.endContainer

  // Find start/end segment elements
  const startSegmentEl = findSegmentEl(startContainer)
  const endSegmentEl = findSegmentEl(endContainer)

  const startLineEl = startSegmentEl?.closest('[data-line-id]') as HTMLElement | null
  const endLineEl = endSegmentEl?.closest('[data-line-id]') as HTMLElement | null

  if (!startSegmentEl || !endSegmentEl || !startLineEl || !endLineEl) return

  const startLineId = startLineEl.dataset.lineId
  const endLineId = endLineEl.dataset.lineId
  const startSegmentId = startSegmentEl.dataset.segmentId
  const endSegmentId = endSegmentEl.dataset.segmentId

  if (!startLineId || !endLineId || !startSegmentId || !endSegmentId) return

  // Selection across different lines is not supported
  if (startLineId !== endLineId) {
    selection.removeAllRanges()
    return
  }

  const startOffset = range.startOffset
  const endOffset = range.endOffset

  if (startSegmentId === endSegmentId) {
    // Selection within same segment
    if (startOffset !== endOffset) {
      hideSelection(startLineId, startSegmentId, Math.min(startOffset, endOffset), Math.max(startOffset, endOffset))
    }
  } else {
    // Selection across multiple segments
    hideMultiSegmentSelection(startLineId, startSegmentId, startOffset, endSegmentId, endOffset)
  }

  selection.removeAllRanges()
}

function findSegmentEl(node: Node): HTMLElement | null {
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as HTMLElement
  if (!el) return null
  return el.closest('[data-segment-id]') as HTMLElement | null
}

function onMouseUp() {
  handleSelectionHide()
}

function onTouchEnd() {
  // Use setTimeout to allow selection to complete on mobile
  setTimeout(() => {
    handleSelectionHide()
  }, 10)
}

onMounted(async () => {
  // Load session document
  await loadSessionDocument()

  // Focus on textarea if no document
  if (!document.value) {
    textareaRef.value?.focus()
  }
})
</script>

<style scoped>
.editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.input-mode,
.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.text-input {
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  background-color: #1a1a1a;
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
}

.text-input:focus {
  outline: none;
  border-color: #5a5a5a;
}

.text-input::placeholder {
  color: #666;
}

.apply-btn {
  align-self: flex-end;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.apply-btn:hover {
  background-color: #2563eb;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.cancel-btn {
  background-color: #6b7280;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background-color: #4b5563;
}

.editor-content {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #2a2a2a;
}

.save-btn,
.edit-btn,
.clear-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.save-btn:hover,
.edit-btn:hover,
.clear-btn:hover {
  background-color: #3a3a3a;
}

.toggle-visibility-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-right: auto;
}

.toggle-visibility-btn:hover {
  background-color: #3a3a3a;
  color: #3b82f6;
}

.text-content {
  font-size: 1rem;
  line-height: 1.6;
}
</style>
