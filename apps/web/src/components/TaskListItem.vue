<script setup lang="ts">
import type { Task } from '../api/types'
import StatusBadge from './StatusBadge.vue'
import { onLinkClick } from '../router'

defineProps<{
  task: Task
  assigneeName: string | null
}>()
</script>

<template>
  <li class="task-item">
    <a
      class="task-item__link"
      :href="`/tasks/${task.id}`"
      @click="onLinkClick($event, `/tasks/${task.id}`)"
    >
      <div class="task-item__header">
        <span class="task-item__title">{{ task.title }}</span>
        <StatusBadge :status="task.status" />
      </div>
      <p v-if="task.description" class="task-item__description">{{ task.description }}</p>
      <p class="task-item__assignee">{{ assigneeName ?? 'Без исполнителя' }}</p>
    </a>
  </li>
</template>

<style scoped>
.task-item {
  border-bottom: 1px solid #ddd;
}
.task-item__link {
  display: block;
  padding: 0.75rem 0;
  color: inherit;
  text-decoration: none;
}
.task-item__link:hover {
  background: #f7f7f7;
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
