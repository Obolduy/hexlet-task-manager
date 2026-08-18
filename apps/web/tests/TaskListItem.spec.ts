import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskListItem from '../src/components/TaskListItem.vue'
import type { Task } from '../src/api/types'

const task: Task = {
  id: 1,
  title: 'Написать спеку',
  description: null,
  status: 'new',
  assigneeId: null,
  createdAt: '2026-08-16T12:00:00.000Z',
  updatedAt: '2026-08-16T12:00:00.000Z',
}

describe('TaskListItem', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-18T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the relative creation date and keeps the exact one in title', () => {
    const wrapper = mount(TaskListItem, { props: { task, assigneeName: null } })

    expect(wrapper.text()).toContain('2 дня назад')

    const createdEl = wrapper.find('.task-item__created')
    expect(createdEl.attributes('title')).toBe(task.createdAt)
  })
})
