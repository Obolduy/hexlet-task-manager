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
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  background: #e5e5e5;
}
</style>
