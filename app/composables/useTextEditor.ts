import type { TextSegment, TextLine, MaoDocument, MaoFileListItem, MaoTextFile } from '~/types/editor'
import { serializeToText, parseFromText } from '~/utils/textSerializer'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// Match only actual characters (alphabets, numbers, Korean, etc.) excluding spaces and special characters
const WORD_CHAR_REGEX = /[\p{L}\p{N}]/u

// Check if character is a word character
function isWordChar(char: string): boolean {
  return WORD_CHAR_REGEX.test(char)
}

// Expand selection range to word boundaries
function expandToWordBoundary(text: string, start: number, end: number): [number, number] {
  // Expand start point to word beginning
  let newStart = start
  while (newStart > 0 && isWordChar(text[newStart - 1] || '')) {
    newStart--
  }

  // Expand end point to word end
  let newEnd = end
  while (newEnd < text.length && isWordChar(text[newEnd] || '')) {
    newEnd++
  }

  return [newStart, newEnd]
}

// Split text into word/non-word segments
function splitByWordBoundary(text: string, hidden: boolean): TextSegment[] {
  const segments: TextSegment[] = []
  let currentText = ''
  let currentIsWord: boolean | null = null

  for (const char of text) {
    const charIsWord = isWordChar(char)

    if (currentIsWord === null) {
      currentIsWord = charIsWord
      currentText = char
    } else if (charIsWord === currentIsWord) {
      currentText += char
    } else {
      // Boundary found: save previous segment
      if (currentText) {
        segments.push({
          id: generateId(),
          text: currentText,
          hidden: currentIsWord ? hidden : false // Hide only words
        })
      }
      currentText = char
      currentIsWord = charIsWord
    }
  }

  // Last segment
  if (currentText) {
    segments.push({
      id: generateId(),
      text: currentText,
      hidden: currentIsWord ? hidden : false
    })
  }

  return segments
}

export function useTextEditor() {
  // Share state using Nuxt useState
  const document = useState<MaoDocument | null>('mao-document', () => null)
  const currentFileId = useState<string | null>('mao-current-file-id', () => null)
  const fileList = useState<MaoFileListItem[]>('mao-file-list', () => [])
  const isEditMode = useState<boolean>('mao-edit-mode', () => false)
  const showAllHidden = useState<boolean>('mao-show-all-hidden', () => false)
  const { getSessionId } = useSession()
  const { saveTextFile, loadTextFile, loadFileList, deleteTextFile, renameTextFile } = useFirestore()

  // Load file list
  async function refreshFileList() {
    const sessionId = getSessionId()
    const files = await loadFileList(sessionId)
    fileList.value = files
  }

  // Select specific file
  async function selectFile(fileId: string) {
    const sessionId = getSessionId()
    const loaded = await loadTextFile(sessionId, fileId)
    if (loaded) {
      document.value = parseFromText(loaded.content)
      currentFileId.value = fileId
    }
  }

  // Start new file
  function createNewFile() {
    document.value = null
    currentFileId.value = null
  }

  // Generate title with OpenAI
  async function generateTitle(content: string): Promise<string> {
    try {
      const response = await $fetch<{ title: string }>('/api/generate-title', {
        method: 'POST',
        body: { content }
      })
      return response.title
    } catch (error) {
      console.error('Error generating title:', error)
      return '새 문서'
    }
  }

  // Manual save
  async function saveToFirestore() {
    if (document.value) {
      const sessionId = getSessionId()
      const fileId = currentFileId.value || generateId()
      const content = serializeToText(document.value)

      // Check if file already exists
      const existingFile = currentFileId.value ? await loadTextFile(sessionId, currentFileId.value) : null

      let title: string
      let isAiGenerated = false

      // Generate AI title only on first save (when no existing file)
      if (!existingFile) {
        title = await generateTitle(content)
        isAiGenerated = true
      } else {
        // Keep both title and flag if existing file
        title = existingFile.name
        isAiGenerated = existingFile.isAiGenerated || false
      }

      const result = await saveTextFile(sessionId, fileId, title, content, isAiGenerated)

      if (result) {
        currentFileId.value = fileId
        await refreshFileList()
      }
      return result
    }
    return false
  }

  // Parse text into Document structure
  function parseText(text: string): MaoDocument {
    const lines = text.split('\n').map((lineText): TextLine => {
      // Split each line by word boundaries
      const segments = lineText ? splitByWordBoundary(lineText, false) : [{
        id: generateId(),
        text: '',
        hidden: false
      }]

      return {
        id: generateId(),
        segments
      }
    })

    return {
      id: generateId(),
      lines,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  // Handle paste
  function handlePaste(text: string) {
    const parsed = parseText(text)
    document.value = parsed
  }

  // Toggle segment
  function toggleSegment(lineId: string, segmentId: string) {
    if (!document.value) return

    const line = document.value.lines.find(l => l.id === lineId)
    if (!line) return

    const segment = line.segments.find(s => s.id === segmentId)
    if (segment) {
      segment.hidden = !segment.hidden
      document.value.updatedAt = new Date()
    }
  }

  // Hide selection within single segment
  function hideSelection(
    lineId: string,
    segmentId: string,
    startOffset: number,
    endOffset: number
  ) {
    if (!document.value) return

    const line = document.value.lines.find(l => l.id === lineId)
    if (!line) return

    const segmentIndex = line.segments.findIndex(s => s.id === segmentId)
    if (segmentIndex === -1) return

    const segment = line.segments[segmentIndex]
    if (!segment) return

    const text = segment.text

    // Expand selection range to word boundaries
    const [expandedStart, expandedEnd] = expandToWordBoundary(text, startOffset, endOffset)

    // Split based on selection area
    const before = text.slice(0, expandedStart)
    const selected = text.slice(expandedStart, expandedEnd)
    const after = text.slice(expandedEnd)

    const newSegments: TextSegment[] = []

    if (before) {
      newSegments.push({
        id: generateId(),
        text: before,
        hidden: segment.hidden
      })
    }

    // Split selected text into word/non-word and hide only words
    if (selected) {
      newSegments.push(...splitByWordBoundary(selected, true))
    }

    if (after) {
      newSegments.push({
        id: generateId(),
        text: after,
        hidden: segment.hidden
      })
    }

    // Replace existing segment with new segments
    line.segments.splice(segmentIndex, 1, ...newSegments)
    document.value.updatedAt = new Date()
  }

  // Handle selection across multiple segments in same line
  function hideMultiSegmentSelection(
    lineId: string,
    startSegmentId: string,
    startOffset: number,
    endSegmentId: string,
    endOffset: number
  ) {
    if (!document.value) return

    const line = document.value.lines.find(l => l.id === lineId)
    if (!line) return

    const startIdx = line.segments.findIndex(s => s.id === startSegmentId)
    const endIdx = line.segments.findIndex(s => s.id === endSegmentId)

    if (startIdx === -1 || endIdx === -1) return

    // Correct order (handle reverse drag)
    const [fromIdx, toIdx, fromOffset, toOffset] = startIdx <= endIdx
      ? [startIdx, endIdx, startOffset, endOffset]
      : [endIdx, startIdx, endOffset, startOffset]

    const newSegments: TextSegment[] = []

    for (let i = 0; i < line.segments.length; i++) {
      const seg = line.segments[i]
      if (!seg) continue

      if (i < fromIdx || i > toIdx) {
        // Outside selection range: keep as is
        newSegments.push(seg)
      } else if (i === fromIdx && i === toIdx) {
        // Selection within same segment (single segment)
        const before = seg.text.slice(0, fromOffset)
        const selected = seg.text.slice(fromOffset, toOffset)
        const after = seg.text.slice(toOffset)

        if (before) newSegments.push({ id: generateId(), text: before, hidden: seg.hidden })
        if (selected) newSegments.push(...splitByWordBoundary(selected, true))
        if (after) newSegments.push({ id: generateId(), text: after, hidden: seg.hidden })
      } else if (i === fromIdx) {
        // Start segment: expand to word boundary
        const [expandedStart, expandedEnd] = expandToWordBoundary(seg.text, fromOffset, seg.text.length)
        const before = seg.text.slice(0, expandedStart)
        const selected = seg.text.slice(expandedStart, expandedEnd)

        if (before) newSegments.push({ id: generateId(), text: before, hidden: seg.hidden })
        if (selected) newSegments.push(...splitByWordBoundary(selected, true))
      } else if (i === toIdx) {
        // End segment: expand to word boundary
        const [expandedStart, expandedEnd] = expandToWordBoundary(seg.text, 0, toOffset)
        const selected = seg.text.slice(expandedStart, expandedEnd)
        const after = seg.text.slice(expandedEnd)

        if (selected) newSegments.push(...splitByWordBoundary(selected, true))
        if (after) newSegments.push({ id: generateId(), text: after, hidden: seg.hidden })
      } else {
        // Middle segment: hide only words
        newSegments.push(...splitByWordBoundary(seg.text, true))
      }
    }

    line.segments = newSegments
    document.value.updatedAt = new Date()
  }

  // Clear document
  function clearDocument() {
    document.value = null
    currentFileId.value = null
  }

  // Enter edit mode
  function enterEditMode() {
    isEditMode.value = true
  }

  // Exit edit mode and update text
  function exitEditMode(newText: string) {
    if (document.value) {
      const updated = parseFromText(newText)
      document.value = updated
    }
    isEditMode.value = false
  }

  // Convert document to plain text (for editing, represent hidden state with {{ }})
  function getPlainText(): string {
    if (!document.value) return ''
    return document.value.lines
      .map(line => line.segments.map(s => s.hidden ? `{{${s.text}}}` : s.text).join(''))
      .join('\n')
  }

  // Load session document (initial load)
  async function loadSessionDocument() {
    await refreshFileList()

    // Load first file if file list exists
    if (fileList.value.length > 0) {
      await selectFile(fileList.value[0]!.id)
    }
  }

  // Delete file
  async function deleteFile(fileId: string) {
    const sessionId = getSessionId()
    const result = await deleteTextFile(sessionId, fileId)

    if (result) {
      // Clear if deleted file is current file
      if (currentFileId.value === fileId) {
        document.value = null
        currentFileId.value = null
      }

      // Refresh file list
      await refreshFileList()

      // Load first file if file list exists (auto select after deletion)
      if (fileList.value.length > 0 && !currentFileId.value) {
        await selectFile(fileList.value[0]!.id)
      }
    }

    return result
  }

  // Rename file
  async function renameFile(fileId: string, newName: string) {
    const sessionId = getSessionId()
    const result = await renameTextFile(sessionId, fileId, newName)

    if (result) {
      // Refresh file list
      await refreshFileList()
    }

    return result
  }

  // Export all files (JSON download)
  async function exportAllFiles() {
    const sessionId = getSessionId()
    const files = await loadFileList(sessionId)

    // Load full content of all files
    const allFilesData = []
    for (const file of files) {
      const fullFile = await loadTextFile(sessionId, file.id)
      if (fullFile) {
        allFilesData.push(fullFile)
      }
    }

    // Download as JSON file
    const dataStr = JSON.stringify(allFilesData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `mao-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import all files (JSON upload)
  async function importAllFiles(filesData: MaoTextFile[]) {
    const sessionId = getSessionId()
    let successCount = 0

    // Get existing file ID list
    const existingFiles = await loadFileList(sessionId)
    const existingIds = new Set(existingFiles.map(f => f.id))

    for (const fileData of filesData) {
      if (fileData.id && fileData.name && fileData.content) {
        // Skip if ID already exists
        if (existingIds.has(fileData.id)) {
          continue
        }

        // Use original ID as is
        const result = await saveTextFile(sessionId, fileData.id, fileData.name, fileData.content)
        if (result) {
          successCount++
          existingIds.add(fileData.id) // Record added ID too
        }
      }
    }

    // Refresh file list
    await refreshFileList()

    // Load first file
    if (fileList.value.length > 0) {
      await selectFile(fileList.value[0]!.id)
    }

    return successCount
  }

  // Toggle show all hidden
  function toggleShowAllHidden() {
    showAllHidden.value = !showAllHidden.value
  }

  return {
    document,
    currentFileId,
    fileList,
    isEditMode,
    showAllHidden,
    handlePaste,
    toggleSegment,
    hideSelection,
    hideMultiSegmentSelection,
    clearDocument,
    loadSessionDocument,
    saveToFirestore,
    refreshFileList,
    selectFile,
    createNewFile,
    deleteFile,
    renameFile,
    enterEditMode,
    exitEditMode,
    getPlainText,
    exportAllFiles,
    importAllFiles,
    toggleShowAllHidden
  }
}
