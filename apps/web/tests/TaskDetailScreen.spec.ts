import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import TaskDetailScreen from '../src/components/TaskDetailScreen.vue'

const task = {
  id: 1,
  title: 'Написать отчёт',
  description: 'Собрать метрики за неделю',
  status: 'in_progress',
  assignee_id: 7,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-02T00:00:00Z',
}

const users = [{ id: 7, name: 'Иван Иванов', email: 'ivan@example.com' }]

let router: Router

beforeEach(() => {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'tasks', component: { template: '<div />' } },
      { path: '/tasks/:id', name: 'task-detail', component: TaskDetailScreen },
    ],
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('TaskDetailScreen', () => {
  it('renders the task details once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        const body = url.includes('/tasks/1') ? task : users
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) })
      })
    )

    router.push('/tasks/1')
    await router.isReady()
    const wrapper = mount(TaskDetailScreen, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Написать отчёт')
    expect(wrapper.text()).toContain('Собрать метрики за неделю')
    expect(wrapper.text()).toContain('Иван Иванов')
  })

  it('shows a not-found message for a missing task', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) }))
    )

    router.push('/tasks/999')
    await router.isReady()
    const wrapper = mount(TaskDetailScreen, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('Задача не найдена')
  })
})
