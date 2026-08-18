import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from '../src/utils/relativeTime'

const NOW = new Date('2026-08-18T12:00:00.000Z')

function isoSecondsAgo(seconds: number): string {
  return new Date(NOW.getTime() - seconds * 1000).toISOString()
}

describe('formatRelativeTime', () => {
  it.each([
    [0, 'только что'],
    [30, 'только что'],
  ])('renders "just now" for %s seconds ago', (seconds, expected) => {
    expect(formatRelativeTime(isoSecondsAgo(seconds), NOW)).toBe(expected)
  })

  it.each([
    [60, '1 минуту назад'],
    [120, '2 минуты назад'],
    [300, '5 минут назад'],
    [21 * 60, '21 минуту назад'],
  ])('renders minutes for %s seconds ago', (seconds, expected) => {
    expect(formatRelativeTime(isoSecondsAgo(seconds), NOW)).toBe(expected)
  })

  it.each([
    [3600, '1 час назад'],
    [2 * 3600, '2 часа назад'],
    [5 * 3600, '5 часов назад'],
  ])('renders hours for %s seconds ago', (seconds, expected) => {
    expect(formatRelativeTime(isoSecondsAgo(seconds), NOW)).toBe(expected)
  })

  it.each([
    [24 * 3600, 'вчера'],
    [47 * 3600, 'вчера'],
  ])('renders "yesterday" for %s seconds ago', (seconds, expected) => {
    expect(formatRelativeTime(isoSecondsAgo(seconds), NOW)).toBe(expected)
  })

  it.each([
    [2 * 24 * 3600, '2 дня назад'],
    [6 * 24 * 3600, '6 дней назад'],
  ])('renders days for %s seconds ago', (seconds, expected) => {
    expect(formatRelativeTime(isoSecondsAgo(seconds), NOW)).toBe(expected)
  })

  it.each([
    [7 * 24 * 3600, '11.08.2026'],
    [30 * 24 * 3600, '19.07.2026'],
  ])('renders absolute date for %s seconds ago', (seconds, expected) => {
    expect(formatRelativeTime(isoSecondsAgo(seconds), NOW)).toBe(expected)
  })

  it('treats a date in the future as "just now"', () => {
    const future = new Date(NOW.getTime() + 60_000).toISOString()
    expect(formatRelativeTime(future, NOW)).toBe('только что')
  })
})
