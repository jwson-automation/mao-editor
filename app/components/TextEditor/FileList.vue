<template>
  <div class="file-list">
    <div class="file-list-header">
      <h3>{{ t.savedDocuments }}</h3>
      <div class="header-actions">
        <button class="action-btn" @click="$emit('export-all')">{{ t.exportAll }}</button>
        <button class="action-btn" @click="$emit('import-all')">{{ t.importAll }}</button>
        <button class="new-file-btn" @click="$emit('new-file')">{{ t.newDocument }}</button>
      </div>
    </div>
    <div v-if="files.length === 0" class="empty-state">
      {{ t.noDocuments }}
    </div>
    <div v-else class="file-items">
      <div
        v-for="file in paginatedFiles"
        :key="file.id"
        class="file-item"
        :class="{ active: file.id === currentFileId }"
      >
        <div class="file-info" @click="$emit('select-file', file.id)">
          <div v-if="editingFileId === file.id" class="file-name-edit">
            <input
              ref="titleInputRef"
              v-model="editingTitle"
              class="title-input"
              @keyup.enter="saveTitle(file.id)"
              @keyup.esc="cancelEdit"
              @click.stop
            >
          </div>
          <div v-else class="file-name">{{ file.name }}</div>
          <div class="file-date">{{ formatDate(file.updatedAt) }}</div>
        </div>
        <div class="file-actions">
          <button v-if="editingFileId === file.id" class="action-icon-btn" :title="t.apply" @click.stop="saveTitle(file.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
          <button v-else class="action-icon-btn" :title="t.editTitle" @click.stop="startEditTitle(file)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </button>
          <button class="delete-btn" :title="t.delete" @click.stop="$emit('delete-file', file.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MaoFileListItem } from '~/types/editor'

const { t } = useI18n()

const emit = defineEmits<{
  'select-file': [fileId: string]
  'new-file': []
  'delete-file': [fileId: string]
  'export-all': []
  'import-all': []
  'rename-file': [fileId: string, newName: string]
}>()

const editingFileId = ref<string | null>(null)
const editingTitle = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

const currentPage = ref(1)
const itemsPerPage = 5

const props = defineProps<{
  files: MaoFileListItem[]
  currentFileId: string | null
}>()

const totalPages = computed(() => Math.ceil(props.files.length / itemsPerPage))
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.files.slice(start, end)
})

function goToPage(page: number) {
  currentPage.value = page
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function startEditTitle(file: MaoFileListItem) {
  editingFileId.value = file.id
  editingTitle.value = file.name
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

function saveTitle(fileId: string) {
  if (editingTitle.value.trim()) {
    emit('rename-file', fileId, editingTitle.value.trim())
  }
  cancelEdit()
}

function cancelEdit() {
  editingFileId.value = null
  editingTitle.value = ''
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t.value.justNow
  if (minutes < 60) return t.value.minutesAgo(minutes)
  if (hours < 24) return t.value.hoursAgo(hours)
  if (days < 7) return t.value.daysAgo(days)

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.file-list {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #2a2a2a;
}

.file-list-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #fff;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background-color: #3a3a3a;
}

.new-file-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.new-file-btn:hover {
  background-color: #2563eb;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  background-color: #2a2a2a;
  padding: 0.75rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.file-item:hover {
  background-color: #3a3a3a;
}

.file-item.active {
  background-color: #3b82f6;
}

.file-info {
  flex: 1;
  cursor: pointer;
}

.file-name {
  font-size: 0.875rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.file-date {
  font-size: 0.75rem;
  color: #999;
}

.file-item.active .file-date {
  color: #e0e0e0;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.file-item.active .delete-btn {
  color: #e0e0e0;
}

.file-item.active .delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.3);
  color: #fee;
}

.file-actions {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.action-icon-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.action-icon-btn:hover {
  background-color: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.file-item.active .action-icon-btn {
  color: #e0e0e0;
}

.file-item.active .action-icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.file-name-edit {
  width: 100%;
}

.title-input {
  width: 100%;
  background-color: #1a1a1a;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  font-family: inherit;
}

.title-input:focus {
  outline: none;
  border-color: #60a5fa;
}

.file-item.active .title-input {
  background-color: #2563eb;
  border-color: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #2a2a2a;
}

.page-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #3a3a3a;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  color: #999;
  font-size: 0.875rem;
  min-width: 60px;
  text-align: center;
}
</style>
