import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskListItem from '../src/components/TaskListItem.vue'
import type { Task } from '../src/api/types'
import { onLinkClick } from '../src/router'

vi.mock('../src/router', () => ({
  onLinkClick: vi.fn((event: MouseEvent) => event.preventDefault()),
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

describe('TaskListItem', () => {
  it('renders a link to the task with the correct href', () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ id: 42 }), assigneeName: null },
    })

    expect(wrapper.get('a').attributes('href')).toBe('/tasks/42')
  })

  it('calls onLinkClick when the link is clicked', async () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ id: 42 }), assigneeName: null },
    })

    await wrapper.get('a').trigger('click')

    expect(onLinkClick).toHaveBeenCalledWith(expect.anything(), '/tasks/42')
  })
})
