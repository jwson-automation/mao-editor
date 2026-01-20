<template>
  <div class="migration-dialog">
    <h3>{{ t.migrateDocumentsTitle }}</h3>
    <p>{{ t.migrateDocumentsMessage(documentCount) }}</p>
    <div class="button-group">
      <button class="confirm-btn" @click="emit('confirm')">
        {{ t.migrateDocumentsConfirm }}
      </button>
      <button class="skip-btn" @click="emit('skip')">
        {{ t.migrateDocumentsSkip }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  documentCount: number
}>()

const emit = defineEmits<{
  confirm: []
  skip: []
}>()

const { t } = useI18n()
</script>

<style scoped>
.migration-dialog {
  padding: 1rem;
}

h3 {
  color: #fff;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

p {
  color: #ccc;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 0.75rem;
}

.confirm-btn,
.skip-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
}

.confirm-btn {
  background-color: #3b82f6;
  color: #fff;
}

.confirm-btn:hover {
  background-color: #2563eb;
}

.skip-btn {
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #3a3a3a;
}

.skip-btn:hover {
  background-color: #3a3a3a;
  border-color: #4a4a4a;
}
</style>
