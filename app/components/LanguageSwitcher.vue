<template>
  <div class="language-switcher">
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
  position: relative;
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
