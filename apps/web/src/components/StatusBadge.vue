<script setup lang="ts">
import type { TaskStatus } from '../api/types'

const props = defineProps<{ status: TaskStatus }>()

const labels: Record<TaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  in_review: 'На проверке',
  done: 'Готово',
}
</script>

<template>
  <span class="status-badge" :class="`status-badge--${props.status}`">
    {{ labels[props.status] }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}
.status-badge--new {
  background: var(--new-bg);
  color: var(--new-fg);
}
.status-badge--in_progress {
  background: var(--progress-bg);
  color: var(--progress-fg);
}
.status-badge--in_review {
  background: var(--review-bg);
  color: var(--review-fg);
}
.status-badge--done {
  background: var(--done-bg);
  color: var(--done-fg);
}
</style>
