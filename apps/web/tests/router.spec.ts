import { describe, expect, it } from 'vitest'
import { currentRoute, navigate, onLinkClick, parseLocation } from '../src/router'

describe('router', () => {
  it('parseLocation returns list for root path', () => {
    history.replaceState(null, '', '/')
    expect(parseLocation()).toEqual({ name: 'list' })
  })

  it('parseLocation returns task-detail for /tasks/42', () => {
    history.replaceState(null, '', '/tasks/42')
    expect(parseLocation()).toEqual({ name: 'task-detail', id: 42 })
  })

  it('parseLocation returns list for a non-numeric task id', () => {
    history.replaceState(null, '', '/tasks/abc')
    expect(parseLocation()).toEqual({ name: 'list' })
  })

  it('parseLocation returns list for an unrelated path', () => {
    history.replaceState(null, '', '/foo/bar')
    expect(parseLocation()).toEqual({ name: 'list' })
  })

  it('navigate updates the pathname and currentRoute', () => {
    navigate('/tasks/7')
    expect(window.location.pathname).toBe('/tasks/7')
    expect(currentRoute.value).toEqual({ name: 'task-detail', id: 7 })
  })

  it('popstate updates currentRoute', () => {
    history.pushState(null, '', '/tasks/9')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(currentRoute.value).toEqual({ name: 'task-detail', id: 9 })
  })

  it('onLinkClick prevents default and navigates on a plain left click', () => {
    const event = new MouseEvent('click', { button: 0, cancelable: true })
    onLinkClick(event, '/tasks/3')
    expect(event.defaultPrevented).toBe(true)
    expect(currentRoute.value).toEqual({ name: 'task-detail', id: 3 })
  })

  it('onLinkClick ignores modified and non-left clicks', () => {
    const ctrlEvent = new MouseEvent('click', { button: 0, ctrlKey: true, cancelable: true })
    onLinkClick(ctrlEvent, '/tasks/5')
    expect(ctrlEvent.defaultPrevented).toBe(false)

    const rightClickEvent = new MouseEvent('click', { button: 2, cancelable: true })
    onLinkClick(rightClickEvent, '/tasks/5')
    expect(rightClickEvent.defaultPrevented).toBe(false)
  })
})
