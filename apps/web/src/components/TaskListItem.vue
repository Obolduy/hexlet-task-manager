<script setup lang="ts">
import type { Task } from '../api/types'
import StatusBadge from './StatusBadge.vue'

defineProps<{
  task: Task
  assigneeName: string | null
}>()
</script>

<template>
  <li class="task-item" :class="`task-item--${task.status}`">
    <div class="task-item__header">
      <span class="task-item__title">{{ task.title }}</span>
      <StatusBadge :status="task.status" />
    </div>
    <p v-if="task.description" class="task-item__description">{{ task.description }}</p>
    <p class="task-item__assignee">{{ assigneeName ?? 'Без исполнителя' }}</p>
  </li>
</template>

<style scoped>
.task-item {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 3px solid var(--ink-soft);
  border-radius: 4px;
  padding: 0.85rem 1rem;
}
.task-item + .task-item {
  margin-top: 0.6rem;
}
.task-item--new {
  border-left-color: var(--new-fg);
}
.task-item--in_progress {
  border-left-color: var(--progress-fg);
}
.task-item--in_review {
  border-left-color: var(--review-fg);
}
.task-item--done {
  border-left-color: var(--done-fg);
}
.task-item__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
}
.task-item__title {
  font-weight: 600;
  font-size: 0.95rem;
}
.task-item__description {
  margin: 0.4rem 0 0;
  color: var(--ink-soft);
  font-size: 0.9rem;
}
.task-item__assignee {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--ink-soft);
}
</style>
