<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Task, User } from '../api/types'
import { fetchTasks } from '../api/tasks'
import { fetchUsers } from '../api/users'
import TaskList from './TaskList.vue'

const tasks = ref<Task[]>([])
const users = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

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
</script>

<template>
  <h1>Задачи</h1>
  <p v-if="isLoading">Загрузка…</p>
  <p v-else-if="error">{{ error }}</p>
  <TaskList v-else :tasks="tasks" :assignee-name-by-id="assigneeNameById" />
</template>
