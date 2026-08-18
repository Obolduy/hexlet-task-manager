<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Task, User } from '../api/types'
import { completeTask, fetchTasks } from '../api/tasks'
import { fetchUsers } from '../api/users'
import TaskList from './TaskList.vue'

const tasks = ref<Task[]>([])
const users = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const completingTaskId = ref<number | null>(null)
const completeError = ref<string | null>(null)

const assigneeNameById = computed<Record<number, string>>(() =>
  Object.fromEntries(users.value.map((user) => [user.id, user.name]))
)

onMounted(async () => {
  try {
    const [loadedTasks, loadedUsers] = await Promise.all([fetchTasks(), fetchUsers()])
    tasks.value = loadedTasks
    users.value = loadedUsers
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось загрузить данные'
  } finally {
    isLoading.value = false
  }
})

async function handleComplete(taskId: number) {
  completingTaskId.value = taskId
  completeError.value = null
  try {
    const updated = await completeTask(taskId)
    const index = tasks.value.findIndex((task) => task.id === taskId)
    if (index !== -1) {
      tasks.value[index] = updated
    }
  } catch (err) {
    completeError.value = err instanceof Error ? err.message : 'Не удалось завершить задачу'
  } finally {
    completingTaskId.value = null
  }
}
</script>

<template>
  <p v-if="isLoading">Загрузка…</p>
  <p v-else-if="error">{{ error }}</p>
  <template v-else>
    <p v-if="completeError">{{ completeError }}</p>
    <TaskList
      :tasks="tasks"
      :assignee-name-by-id="assigneeNameById"
      :completing-task-id="completingTaskId"
      @complete="handleComplete"
    />
  </template>
</template>
