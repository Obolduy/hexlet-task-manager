import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TaskDetailScreen from '../src/components/TaskDetailScreen.vue'
import TaskDetailCard from '../src/components/TaskDetailCard.vue'
import type { Task } from '../src/api/types'
import { TaskFetchError } from '../src/api/tasks'

const fetchTaskMock = vi.fn()
const fetchUsersMock = vi.fn()

vi.mock('../src/api/tasks', async () => {
  const actual = await vi.importActual<typeof import('../src/api/tasks')>('../src/api/tasks')
  return {
    ...actual,
    fetchTask: (id: number) => fetchTaskMock(id),
  }
})

vi.mock('../src/api/users', () => ({
  fetchUsers: () => fetchUsersMock(),
}))

vi.mock('../src/router', () => ({
  onLinkClick: vi.fn(),
}))

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

describe('TaskDetailScreen', () => {
  it('renders loading state before the response resolves', () => {
    fetchTaskMock.mockReturnValue(new Promise(() => {}))
    fetchUsersMock.mockReturnValue(new Promise(() => {}))

    const wrapper = mount(TaskDetailScreen, { props: { id: 1 } })

    expect(wrapper.text()).toContain('Загрузка…')
  })

  it('renders the task via TaskDetailCard on success', async () => {
    fetchTaskMock.mockResolvedValue(makeTask({ id: 1, title: 'Найдена' }))
    fetchUsersMock.mockResolvedValue([])

    const wrapper = mount(TaskDetailScreen, { props: { id: 1 } })
    await flushPromises()

    expect(wrapper.findComponent(TaskDetailCard).exists()).toBe(true)
    expect(wrapper.text()).toContain('Найдена')
  })

  it('renders "not found" on a 404', async () => {
    fetchTaskMock.mockRejectedValue(new TaskFetchError(404))
    fetchUsersMock.mockResolvedValue([])

    const wrapper = mount(TaskDetailScreen, { props: { id: 999 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Задача не найдена')
  })

  it('renders a generic error on other failures', async () => {
    fetchTaskMock.mockRejectedValue(new Error('Network down'))
    fetchUsersMock.mockResolvedValue([])

    const wrapper = mount(TaskDetailScreen, { props: { id: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Network down')
  })
})
