<script setup lang="ts">
import type { TaskStatus, User } from '../api/types'

const props = defineProps<{
  users: User[]
  status: TaskStatus | null
  assigneeId: number | null
}>()

const emit = defineEmits<{
  'update:status': [value: TaskStatus | null]
  'update:assigneeId': [value: number | null]
}>()

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'in_review', label: 'На проверке' },
  { value: 'done', label: 'Готово' },
]

function onStatusChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:status', value === '' ? null : (value as TaskStatus))
}

function onAssigneeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:assigneeId', value === '' ? null : Number(value))
}
</script>

<template>
  <div class="task-filters">
    <select :value="props.status ?? ''" @change="onStatusChange">
      <option value="">Все статусы</option>
      <option v-for="option in statusOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <select :value="props.assigneeId ?? ''" @change="onAssigneeChange">
      <option value="">Все исполнители</option>
      <option v-for="user in props.users" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.task-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
