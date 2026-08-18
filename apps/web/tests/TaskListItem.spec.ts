import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
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
  it('renders the complete button when the task is not done', () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ status: 'new' }), assigneeName: null, isCompleting: false },
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('hides the complete button when the task is already done', () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ status: 'done' }), assigneeName: null, isCompleting: false },
    })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits complete with the task id when clicked', async () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ id: 42, status: 'new' }), assigneeName: null, isCompleting: false },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('complete')).toEqual([[42]])
  })

  it('disables the button while completing', () => {
    const wrapper = mount(TaskListItem, {
      props: { task: makeTask({ status: 'new' }), assigneeName: null, isCompleting: true },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
