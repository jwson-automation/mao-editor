<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <MaoLogo />

    <!-- Login Modal -->
    <div v-if="showLogin" class="modal-overlay" @click="showLogin = false">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="showLogin = false">×</button>
        <AuthLoginForm @success="handleLoginSuccess" />
      </div>
    </div>

    <!-- Migration Dialog -->
    <div v-if="showMigration" class="modal-overlay" @click="handleMigrationSkip">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="handleMigrationSkip">×</button>
        <AuthMigrationDialog
          :document-count="localDocumentCount"
          @confirm="handleMigrationConfirm"
          @skip="handleMigrationSkip"
        />
      </div>
    </div>

    <div class="main-content">
      <TextEditor />
      <div class="bottom-controls">
        <LanguageSwitcher />
        <AuthUserStatus @show-login="showLogin = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, getDocs } from 'firebase/firestore'

const showLogin = ref(false)
const showMigration = ref(false)
const localDocumentCount = ref(0)
const migrationData = ref<{ sessionId: string, userId: string } | null>(null)

const { migrateLocalDocuments } = useFirestore()
const { t } = useI18n()

async function handleLoginSuccess(username: string) {
  showLogin.value = false

  // Check for local documents
  const { getSessionId } = useSession()
  const sessionId = getSessionId()

  if (!sessionId) {
    window.location.reload()
    return
  }

  try {
    const { $db } = useNuxtApp()

    // Get local session documents
    const localPath = `documents/${sessionId}/files`
    const localFilesRef = collection($db, localPath)
    const localSnapshot = await getDocs(localFilesRef)

    if (localSnapshot.empty) {
      window.location.reload()
      return
    }

    // Get user documents to check for duplicates
    const userPath = `user-documents/${username}/files`
    const userFilesRef = collection($db, userPath)
    const userSnapshot = await getDocs(userFilesRef)
    const existingIds = new Set(userSnapshot.docs.map(doc => doc.id))

    // Count non-duplicate documents
    let uniqueCount = 0
    localSnapshot.docs.forEach(doc => {
      if (!existingIds.has(doc.id)) {
        uniqueCount++
      }
    })

    if (uniqueCount > 0) {
      // Show migration dialog only if there are unique documents
      localDocumentCount.value = uniqueCount
      migrationData.value = { sessionId, userId: username }
      showMigration.value = true
    } else {
      // No unique documents to migrate, just reload to switch to user documents
      window.location.reload()
    }
  } catch (error) {
    console.error('Error checking local documents:', error)
    window.location.reload()
  }
}

async function handleMigrationConfirm() {
  if (!migrationData.value) return

  const { sessionId, userId } = migrationData.value
  const result = await migrateLocalDocuments(sessionId, userId)

  showMigration.value = false

  if (result.success && result.migratedCount > 0) {
    alert(t.value.migratedSuccess(result.migratedCount))
  }

  window.location.reload()
}

function handleMigrationSkip() {
  showMigration.value = false
  window.location.reload()
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding: 1rem;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
}

.bottom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 5rem;
  margin-bottom: 5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background-color: #0a0a0a;
  border-radius: 8px;
  padding: 1rem;
  max-width: 500px;
  width: 90%;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #aaa;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
}
</style>
