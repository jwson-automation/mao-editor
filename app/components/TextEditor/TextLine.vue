<template>
  <div class="text-line" :data-line-id="line.id">
    <TextEditorHiddenSpan
      v-for="segment in line.segments"
      :key="segment.id"
      :segment="segment"
      :show-all-hidden="showAllHidden"
      :data-segment-id="segment.id"
      @toggle="emit('toggleSegment', line.id, segment.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TextLine } from '~/types/editor'

defineProps<{
  line: TextLine
  showAllHidden?: boolean
}>()

const emit = defineEmits<{
  toggleSegment: [lineId: string, segmentId: string]
}>()
</script>

<style scoped>
.text-line {
  min-height: 1.5em;
  line-height: 1.6;
  padding: 0.1em 0;
}
</style>
