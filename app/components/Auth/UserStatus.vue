<template>
  <div class="user-status">
    <div v-if="currentUser" class="logged-in">
      <span class="username">{{ currentUser }}</span>
      <button class="logout-btn" @click="handleLogout">{{ t.logout }}</button>
    </div>
    <button v-else class="login-btn" @click="emit('showLogin')">
      {{ t.login }}
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  showLogin: []
}>()

const { currentUser, logout } = useAuth()
const { t } = useI18n()

function handleLogout() {
  logout()
  // Reload to reset session
  window.location.reload()
}
</script>

<style scoped>
.user-status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logged-in {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: #3b82f6;
  font-weight: 500;
}

.login-btn,
.logout-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #3a3a3a;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.login-btn:hover,
.logout-btn:hover {
  background-color: #3a3a3a;
  border-color: #3b82f6;
}
</style>
