import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskFilters from '../src/components/TaskFilters.vue'
import type { User } from '../src/api/types'

function makeUsers(): User[] {
  return [
    { id: 1, name: 'Алина Петрова', email: 'alina@example.com' },
    { id: 2, name: 'Дмитрий Соколов', email: 'dmitry@example.com' },
  ]
}

describe('TaskFilters', () => {
  it('renders a status option and a select option per user', () => {
    const wrapper = mount(TaskFilters, {
      props: { users: makeUsers(), status: null, assigneeId: null },
    })

    const [statusSelect, assigneeSelect] = wrapper.findAll('select')
    expect(statusSelect.findAll('option')).toHaveLength(5)
    expect(assigneeSelect.findAll('option')).toHaveLength(3)
    expect(assigneeSelect.text()).toContain('Алина Петрова')
  })

  it('emits update:status when the status select changes', async () => {
    const wrapper = mount(TaskFilters, {
      props: { users: makeUsers(), status: null, assigneeId: null },
    })

    const [statusSelect] = wrapper.findAll('select')
    await statusSelect.setValue('done')

    expect(wrapper.emitted('update:status')).toEqual([['done']])
  })

  it('emits update:assigneeId when the assignee select changes', async () => {
    const wrapper = mount(TaskFilters, {
      props: { users: makeUsers(), status: null, assigneeId: null },
    })

    const [, assigneeSelect] = wrapper.findAll('select')
    await assigneeSelect.setValue('2')

    expect(wrapper.emitted('update:assigneeId')).toEqual([[2]])
  })
})
