import { createRouter, createWebHistory } from 'vue-router'
import TaskScreen from './components/TaskScreen.vue'
import TaskDetailScreen from './components/TaskDetailScreen.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'tasks', component: TaskScreen },
    { path: '/tasks/:id', name: 'task-detail', component: TaskDetailScreen },
  ],
})
