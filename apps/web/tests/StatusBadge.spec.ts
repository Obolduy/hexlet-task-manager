import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusBadge from '../src/components/StatusBadge.vue'
import type { TaskStatus } from '../src/api/types'

const cases: Array<[TaskStatus, string]> = [
  ['new', 'Новая'],
  ['in_progress', 'В работе'],
  ['in_review', 'На проверке'],
  ['done', 'Готово'],
]

describe('StatusBadge', () => {
  it.each(cases)('renders label for status %s', (status, label) => {
    const wrapper = mount(StatusBadge, { props: { status } })
    expect(wrapper.text()).toBe(label)
  })
})
