import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TaskDetailScreen from '../src/components/TaskDetailScreen.vue'

function taskResponse(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    title: 'Задача',
    description: 'Описание',
    status: 'new',
    assignee_id: 5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
    ...overrides,
  }
}

describe('TaskDetailScreen', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders loading state before data arrives', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(TaskDetailScreen, { props: { id: 1 } })
    expect(wrapper.text()).toContain('Загрузка…')
  })

  it('renders task details on success', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify(taskResponse()), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 5, name: 'Иван', email: 'ivan@example.com' }]), {
          status: 200,
        })
      )
    const wrapper = mount(TaskDetailScreen, { props: { id: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Задача')
    expect(wrapper.text()).toContain('Описание')
    expect(wrapper.text()).toContain('Иван')
  })

  it('renders not found state on 404', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }))
    const wrapper = mount(TaskDetailScreen, { props: { id: 999 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Задача не найдена')
  })

  it('renders error state on other failures', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
    const wrapper = mount(TaskDetailScreen, { props: { id: 1 } })
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load task: 500')
  })
})
