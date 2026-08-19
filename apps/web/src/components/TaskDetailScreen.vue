<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Task, User } from '../api/types'
import { fetchTask, TaskFetchError } from '../api/tasks'
import { fetchUsers } from '../api/users'
import { onLinkClick } from '../router'
import TaskDetailCard from './TaskDetailCard.vue'

const props = defineProps<{ id: number }>()

const task = ref<Task | null>(null)
const users = ref<User[]>([])
const isLoading = ref(true)
const notFound = ref(false)
const error = ref<string | null>(null)

const assigneeName = computed<string | null>(() => {
  if (task.value === null || task.value.assigneeId === null) {
    return null
  }
  return users.value.find((user) => user.id === task.value!.assigneeId)?.name ?? null
})

onMounted(async () => {
  try {
    const [loadedTask, loadedUsers] = await Promise.all([fetchTask(props.id), fetchUsers()])
    task.value = loadedTask
    users.value = loadedUsers
  } catch (err) {
    if (err instanceof TaskFetchError && err.status === 404) {
      notFound.value = true
    } else {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить задачу'
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <p v-if="isLoading">Загрузка…</p>
  <template v-else-if="notFound">
    <p>Задача не найдена</p>
    <a href="/" @click="onLinkClick($event, '/')">Назад к списку</a>
  </template>
  <template v-else-if="error">
    <p>{{ error }}</p>
    <a href="/" @click="onLinkClick($event, '/')">Назад к списку</a>
  </template>
  <TaskDetailCard v-else-if="task" :task="task" :assignee-name="assigneeName" />
</template>
