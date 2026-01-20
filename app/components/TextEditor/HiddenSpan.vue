<template>
  <span
    class="segment"
    :class="{ hidden: segment.hidden, 'color-only': showAllHidden && segment.hidden, 'tap-enabled': true }"
    @click="handleClick"
    @touchend.stop="handleClick"
  >
    <span v-if="segment.hidden && !showAllHidden" class="hidden-block">
      {{ maskedText }}
    </span>
    <span v-else>{{ segment.text }}</span>
  </span>
</template>

<script setup lang="ts">
import type { TextSegment } from '~/types/editor'

const props = defineProps<{
  segment: TextSegment
  showAllHidden?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const maskedText = computed(() => {
  // Display hidden text as blocks with same width
  return '\u00A0'.repeat(props.segment.text.length)
})

let tapTimeout: ReturnType<typeof setTimeout> | null = null

function handleClick(event: MouseEvent | TouchEvent) {
  // Prevent triggering on text selection
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    return
  }

  // Check if this segment contains actual word characters (not just spaces/punctuation)
  const WORD_CHAR_REGEX = /[\p{L}\p{N}]/u
  const hasWordChars = WORD_CHAR_REGEX.test(props.segment.text)

  // Only toggle if this segment contains word characters
  if (!hasWordChars) {
    return
  }

  // For touch events, prevent double-tap zoom
  if (event instanceof TouchEvent) {
    event.preventDefault()

    if (tapTimeout) {
      clearTimeout(tapTimeout)
      tapTimeout = null
      return
    }

    tapTimeout = setTimeout(() => {
      tapTimeout = null
    }, 300)
  }

  // Toggle on click/tap (both hide and reveal)
  emit('toggle')
}
</script>

<style scoped>
.segment {
  white-space: pre-wrap;
  word-break: break-word;
}

.segment.hidden {
  cursor: pointer;
}

.segment.tap-enabled {
  cursor: pointer;
}

@media (hover: none) {
  .segment.tap-enabled {
    -webkit-tap-highlight-color: rgba(59, 130, 246, 0.2);
  }
}

.hidden-block {
  background-color: #4a4a4a;
  border-radius: 2px;
  color: transparent;
  user-select: none;
  transition: background-color 0.2s ease;
}

.hidden-block:hover {
  background-color: #5a5a5a;
}

.segment.color-only {
  color: #888;
  transition: color 0.2s ease;
}

.segment.color-only:hover {
  color: #aaa;
}
</style>
