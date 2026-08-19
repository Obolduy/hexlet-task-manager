<script setup lang="ts">
import type { Task } from '../api/types'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{
  task: Task
  assigneeName: string | null
  isCompleting: boolean
}>()

const emit = defineEmits<{ complete: [taskId: number] }>()

function handleComplete() {
  emit('complete', props.task.id)
}
</script>

<template>
  <li class="task-item">
    <div class="task-item__header">
      <span class="task-item__title">{{ task.title }}</span>
      <StatusBadge :status="task.status" />
      <button
        v-if="task.status !== 'done'"
        type="button"
        class="task-item__complete"
        :disabled="isCompleting"
        @click="handleComplete"
      >
        Завершить
      </button>
    </div>
    <p v-if="task.description" class="task-item__description">{{ task.description }}</p>
    <p class="task-item__assignee">{{ assigneeName ?? 'Без исполнителя' }}</p>
  </li>
</template>

<style scoped>
.task-item {
  border-bottom: 1px solid #ddd;
  padding: 0.75rem 0;
}
.task-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.task-item__title {
  font-weight: 600;
}
.task-item__description {
  margin: 0.35rem 0;
  color: #555;
}
.task-item__assignee {
  margin: 0;
  font-size: 0.85rem;
  color: #777;
}
</style>
