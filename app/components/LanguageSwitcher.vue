<template>
  <div class="language-switcher">
    <a
      href="https://github.com/jwson-automation/mao-editor"
      target="_blank"
      rel="noopener noreferrer"
      class="github-link"
      title="GitHub Repository"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    </a>
    <button
      class="language-btn"
      :class="{ active: showMenu }"
      title="Language"
      @click="showMenu = !showMenu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    </button>
    <div v-if="showMenu" class="language-menu">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="language-option"
        :class="{ active: locale === lang.code }"
        @click="selectLanguage(lang.code)"
      >
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '~/composables/useI18n'

const { locale, setLocale } = useI18n()
const showMenu = ref(false)

const languages = [
  { code: 'ko' as Locale, name: '한국어' },
  { code: 'en' as Locale, name: 'English' },
  { code: 'ja' as Locale, name: '日本語' }
]

function selectLanguage(lang: Locale) {
  setLocale(lang)
  showMenu.value = false
}

// Close menu on outside click
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.language-switcher')) {
      showMenu.value = false
    }
  }
  window.document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    window.document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.github-link {
  background-color: #2a2a2a;
  color: #999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  text-decoration: none;
}

.github-link:hover {
  background-color: #3a3a3a;
  color: #fff;
}

.language-btn {
  background-color: #2a2a2a;
  color: #999;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.language-btn:hover {
  background-color: #3a3a3a;
  color: #fff;
}

.language-btn.active {
  background-color: #3a3a3a;
  color: #fff;
}

.language-menu {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 120px;
}

.language-option {
  width: 100%;
  background: none;
  border: none;
  color: #fff;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-align: left;
  transition: background-color 0.2s ease;
}

.language-option:hover {
  background-color: #3a3a3a;
}

.language-option.active {
  background-color: #3b82f6;
  color: #fff;
}
</style>
