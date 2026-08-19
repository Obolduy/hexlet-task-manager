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
  <article class="task-detail">
    <a class="task-detail__back" href="/" @click="onLinkClick($event, '/')">← Назад к списку</a>
    <div class="task-detail__header">
      <h2 class="task-detail__title">{{ task.title }}</h2>
      <StatusBadge :status="task.status" />
    </div>
    <p class="task-detail__description">{{ task.description ?? 'Без описания' }}</p>
    <dl class="task-detail__meta">
      <dt>Исполнитель</dt>
      <dd>{{ assigneeName ?? 'Без исполнителя' }}</dd>
      <dt>Создана</dt>
      <dd>{{ task.createdAt }}</dd>
      <dt>Обновлена</dt>
      <dd>{{ task.updatedAt }}</dd>
    </dl>
  </article>
</template>

<style scoped>
.task-detail__back {
  display: inline-block;
  margin-bottom: 1rem;
  color: inherit;
}
.task-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.task-detail__title {
  margin: 0;
}
.task-detail__description {
  color: #555;
}
.task-detail__meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 0.75rem;
  font-size: 0.9rem;
  color: #777;
}
.task-detail__meta dt {
  font-weight: 600;
  color: #555;
}
.task-detail__meta dd {
  margin: 0;
}
</style>
