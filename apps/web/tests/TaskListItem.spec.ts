import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import TaskListItem from '../src/components/TaskListItem.vue'
import type { Task } from '../src/api/types'

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
  it('links to the task detail page', () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ id: 42 }), assigneeName: null },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/tasks/42')
  })
})
