import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskListItem from '../src/components/TaskListItem.vue'
import type { Task } from '../src/api/types'
import * as router from '../src/router'

const task: Task = {
  id: 7,
  title: 'Задача',
  description: null,
  status: 'new',
  assigneeId: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('TaskListItem', () => {
  it('links to the task detail URL', () => {
    const wrapper = mount(TaskListItem, { props: { task, assigneeName: null } })
    expect(wrapper.find('a').attributes('href')).toBe('/tasks/7')
  })

  it('navigates via the router on click', async () => {
    const onLinkClickSpy = vi.spyOn(router, 'onLinkClick')
    const wrapper = mount(TaskListItem, { props: { task, assigneeName: null } })

    await wrapper.find('a').trigger('click')

    expect(onLinkClickSpy).toHaveBeenCalledWith(expect.any(MouseEvent), '/tasks/7')
    onLinkClickSpy.mockRestore()
  })
})
