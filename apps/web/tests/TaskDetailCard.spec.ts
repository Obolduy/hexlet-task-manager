import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskDetailCard from '../src/components/TaskDetailCard.vue'
import type { Task } from '../src/api/types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Задача',
    description: null,
    status: 'new',
    assigneeId: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z',
    ...overrides,
  }
}

describe('TaskDetailCard', () => {
  it('renders title, status, description, assignee and dates', () => {
    const wrapper = mount(TaskDetailCard, {
      props: {
        task: makeTask({ title: 'Сделать спеку', description: 'Описание задачи', status: 'in_review' }),
        assigneeName: 'Иван Иванов',
      },
    })

    expect(wrapper.text()).toContain('Сделать спеку')
    expect(wrapper.text()).toContain('На проверке')
    expect(wrapper.text()).toContain('Описание задачи')
    expect(wrapper.text()).toContain('Иван Иванов')
    expect(wrapper.text()).toContain('2026-01-01T00:00:00Z')
    expect(wrapper.text()).toContain('2026-01-02T00:00:00Z')
  })

  it('shows fallback text when description and assignee are missing', () => {
    const wrapper = mount(TaskDetailCard, {
      props: { task: makeTask({ description: null }), assigneeName: null },
    })

    expect(wrapper.text()).toContain('Без описания')
    expect(wrapper.text()).toContain('Без исполнителя')
  })
})
