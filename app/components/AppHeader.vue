<template>
  <header class="app-header">
    <MaoLogo />
    <div class="header-actions">
      <button class="header-btn" @click="handleExport">전체 파일 저장</button>
      <button class="header-btn" @click="triggerImport">전체 파일 불러오기</button>
      <input
        ref="fileInputRef"
        type="file"
        accept="application/json"
        style="display: none"
        @change="handleImport"
      >
    </div>
  </header>
</template>

<script setup lang="ts">
const { exportAllFiles, importAllFiles } = useTextEditor()
const fileInputRef = ref<HTMLInputElement | null>(null)

async function handleExport() {
  try {
    await exportAllFiles()
    alert('파일이 다운로드되었습니다!')
  } catch (error) {
    console.error('Export error:', error)
    alert('파일 저장에 실패했습니다.')
  }
}

function triggerImport() {
  fileInputRef.value?.click()
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data)) {
      alert('올바른 형식의 파일이 아닙니다.')
      return
    }

    const count = await importAllFiles(data)
    alert(`${count}개의 파일을 불러왔습니다!`)

    // input 초기화
    input.value = ''
  } catch (error) {
    console.error('Import error:', error)
    alert('파일 불러오기에 실패했습니다.')
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #2a2a2a;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.header-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.header-btn:hover {
  background-color: #3a3a3a;
}
</style>
