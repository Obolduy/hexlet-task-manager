<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { Task, User } from '../api/types'
import { fetchTask, TaskNotFoundError } from '../api/tasks'
import { fetchUsers } from '../api/users'
import StatusBadge from './StatusBadge.vue'

const route = useRoute()

const task = ref<Task | null>(null)
const users = ref<User[]>([])
const isLoading = ref(true)
const isNotFound = ref(false)
const error = ref<string | null>(null)

const assigneeName = computed<string | null>(() => {
  if (task.value === null || task.value.assigneeId === null) {
    return null
  }
  return users.value.find((user) => user.id === task.value!.assigneeId)?.name ?? null
})

function formatDate(value: string): string {
  return new Date(value).toLocaleString('ru-RU')
}

async function load(id: number) {
  isLoading.value = true
  isNotFound.value = false
  error.value = null
  task.value = null
  try {
    const [loadedTask, loadedUsers] = await Promise.all([fetchTask(id), fetchUsers()])
    task.value = loadedTask
    users.value = loadedUsers
  } catch (err) {
    if (err instanceof TaskNotFoundError) {
      isNotFound.value = true
    } else {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить задачу'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => load(Number(route.params.id)))
watch(
  () => route.params.id,
  (id) => load(Number(id))
)
</script>

<template>
  <RouterLink to="/" class="task-detail__back">← К списку задач</RouterLink>
  <p v-if="isLoading">Загрузка…</p>
  <p v-else-if="isNotFound">Задача не найдена</p>
  <p v-else-if="error">{{ error }}</p>
  <div v-else-if="task" class="task-detail">
    <div class="task-detail__header">
      <h2 class="task-detail__title">{{ task.title }}</h2>
      <StatusBadge :status="task.status" />
    </div>
    <p class="task-detail__description">{{ task.description ?? 'Без описания' }}</p>
    <dl class="task-detail__meta">
      <dt>Исполнитель</dt>
      <dd>{{ assigneeName ?? 'Без исполнителя' }}</dd>
      <dt>Создана</dt>
      <dd>{{ formatDate(task.createdAt) }}</dd>
      <dt>Обновлена</dt>
      <dd>{{ formatDate(task.updatedAt) }}</dd>
    </dl>
  </div>
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
  white-space: pre-wrap;
}
.task-detail__meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1rem;
}
.task-detail__meta dt {
  color: #777;
}
.task-detail__meta dd {
  margin: 0;
}
</style>
