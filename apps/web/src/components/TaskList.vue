<script setup lang="ts">
import type { Task } from '../api/types'
import TaskListItem from './TaskListItem.vue'

const props = defineProps<{
  tasks: Task[]
  assigneeNameById: Record<number, string>
}>()

function assigneeName(task: Task): string | null {
  return task.assigneeId === null ? null : props.assigneeNameById[task.assigneeId] ?? null
}
</script>

<template>
  <p v-if="tasks.length === 0" class="task-list__empty">Задач нет</p>
  <ul v-else class="task-list">
    <TaskListItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :assignee-name="assigneeName(task)"
    />
  </ul>
</template>

<style scoped>
.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.task-list__empty {
  color: var(--ink-soft);
  padding: 2rem 0;
  text-align: center;
  border: 1px dashed var(--line);
  border-radius: 4px;
}
</style>
