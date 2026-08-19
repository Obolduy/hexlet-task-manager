import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TaskScreen from '../src/components/TaskScreen.vue'
import type { Task, User } from '../src/api/types'

const { fetchTasks, completeTask } = vi.hoisted(() => ({
  fetchTasks: vi.fn(),
  completeTask: vi.fn(),
}))

vi.mock('../src/api/tasks', () => ({ fetchTasks, completeTask }))
vi.mock('../src/api/users', () => ({ fetchUsers: vi.fn(async () => users) }))

const users: User[] = [{ id: 1, name: 'Исполнитель', email: 'a@example.com' }]

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Задача',
    description: null,
    status: 'new',
    assigneeId: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('TaskScreen', () => {
  it('updates the task status in the list after a successful completion', async () => {
    fetchTasks.mockResolvedValueOnce([makeTask({ id: 1, status: 'new' })])
    completeTask.mockResolvedValueOnce(makeTask({ id: 1, status: 'done', updatedAt: 'later' }))

    const wrapper = mount(TaskScreen)
    await flushPromises()

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(completeTask).toHaveBeenCalledWith(1)
    expect(wrapper.text()).toContain('Готово')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('shows an error and keeps the task unchanged when completion fails', async () => {
    fetchTasks.mockResolvedValueOnce([makeTask({ id: 1, status: 'new' })])
    completeTask.mockRejectedValueOnce(new Error('Failed to complete task: 500'))

    const wrapper = mount(TaskScreen)
    await flushPromises()

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to complete task: 500')
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('disables the button while the completion request is in flight', async () => {
    fetchTasks.mockResolvedValueOnce([makeTask({ id: 1, status: 'new' })])
    let resolveComplete!: (task: Task) => void
    completeTask.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveComplete = resolve
      })
    )

    const wrapper = mount(TaskScreen)
    await flushPromises()

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()

    resolveComplete(makeTask({ id: 1, status: 'done' }))
    await flushPromises()
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
