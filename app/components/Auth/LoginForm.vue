<template>
  <div class="auth-form">
    <h2>{{ isSignup ? t.signup : t.login }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">{{ t.username }}</label>
        <input
          id="username"
          v-model="username"
          type="text"
          :placeholder="t.usernamePlaceholder"
          maxlength="20"
          pattern="[a-zA-Z0-9]+"
          @keypress="preventSpace"
          required
        >
      </div>

      <div class="form-group">
        <label for="password">{{ t.password }}</label>
        <input
          id="password"
          v-model="password"
          type="password"
          :placeholder="t.passwordPlaceholder"
          inputmode="numeric"
          pattern="\d{4,}"
          required
        >
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? t.loading : (isSignup ? t.signup : t.login) }}
      </button>
    </form>

    <div class="toggle-mode">
      <button type="button" @click="toggleMode">
        {{ isSignup ? t.alreadyHaveAccount : t.needAccount }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  success: [username: string]
}>()

const { signup, login } = useAuth()
const { t } = useI18n()

const isSignup = ref(false)
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function preventSpace(event: KeyboardEvent) {
  if (event.key === ' ') {
    event.preventDefault()
  }
}

function toggleMode() {
  isSignup.value = !isSignup.value
  error.value = ''
}

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    const result = isSignup.value
      ? await signup({ username: username.value, password: password.value })
      : await login({ username: username.value, password: password.value })

    if (result.success) {
      emit('success', username.value)
    } else {
      error.value = result.error || 'An error occurred'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 2px solid #3a3a3a;
}

h2 {
  margin: 0 0 1.5rem 0;
  color: #fff;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #aaa;
  font-size: 0.875rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  background-color: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

input::placeholder {
  color: #666;
}

.error-message {
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  color: #ef4444;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-mode {
  margin-top: 1.5rem;
  text-align: center;
}

.toggle-mode button {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  padding: 0;
}

.toggle-mode button:hover {
  color: #2563eb;
}
</style>
