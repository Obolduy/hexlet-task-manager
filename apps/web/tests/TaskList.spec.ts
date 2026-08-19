import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../src/components/TaskList.vue'
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

describe('TaskList', () => {
  it('renders one TaskListItem per task', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 }), makeTask({ id: 3 })]
    const wrapper = mount(TaskList, {
      props: { tasks, assigneeNameById: {}, completingTaskId: null },
    })

    expect(wrapper.findAllComponents(TaskListItem)).toHaveLength(3)
  })

  it('renders empty state and no items when tasks is empty', () => {
    const wrapper = mount(TaskList, {
      props: { tasks: [], assigneeNameById: {}, completingTaskId: null },
    })

    expect(wrapper.text()).toContain('Задач нет')
    expect(wrapper.findAllComponents(TaskListItem)).toHaveLength(0)
  })

  it('relays the complete event from a TaskListItem with the task id', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })]
    const wrapper = mount(TaskList, {
      props: { tasks, assigneeNameById: {}, completingTaskId: null },
    })

    wrapper.findAllComponents(TaskListItem)[1]!.vm.$emit('complete', 2)

    expect(wrapper.emitted('complete')).toEqual([[2]])
  })

  it('passes isCompleting only to the matching TaskListItem', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })]
    const wrapper = mount(TaskList, {
      props: { tasks, assigneeNameById: {}, completingTaskId: 2 },
    })

    const items = wrapper.findAllComponents(TaskListItem)
    expect(items[0]!.props('isCompleting')).toBe(false)
    expect(items[1]!.props('isCompleting')).toBe(true)
  })
})
