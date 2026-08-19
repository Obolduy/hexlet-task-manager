import { describe, expect, it, vi } from 'vitest'
import { currentRoute, navigate, onLinkClick, parseLocation } from '../src/router'

describe('parseLocation', () => {
  it('returns the list route for /', () => {
    window.history.pushState(null, '', '/')
    expect(parseLocation()).toEqual({ name: 'list' })
  })

  it('returns a task-detail route for /tasks/:id', () => {
    window.history.pushState(null, '', '/tasks/42')
    expect(parseLocation()).toEqual({ name: 'task-detail', id: 42 })
  })

  it('falls back to the list route for a non-numeric id', () => {
    window.history.pushState(null, '', '/tasks/abc')
    expect(parseLocation()).toEqual({ name: 'list' })
  })

  it('falls back to the list route for an unknown path', () => {
    window.history.pushState(null, '', '/unknown')
    expect(parseLocation()).toEqual({ name: 'list' })
  })
})

describe('navigate', () => {
  it('updates the URL and currentRoute', () => {
    navigate('/tasks/7')
    expect(window.location.pathname).toBe('/tasks/7')
    expect(currentRoute.value).toEqual({ name: 'task-detail', id: 7 })
  })
})

describe('onLinkClick', () => {
  it('navigates on a plain left click and prevents the default navigation', () => {
    const event = new MouseEvent('click', { button: 0, cancelable: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    onLinkClick(event, '/tasks/3')
    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(window.location.pathname).toBe('/tasks/3')
  })

  it('ignores clicks with modifier keys, letting the browser handle them', () => {
    navigate('/')
    const event = new MouseEvent('click', { button: 0, ctrlKey: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    onLinkClick(event, '/tasks/3')
    expect(preventDefaultSpy).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/')
  })

  it('ignores non-left clicks', () => {
    navigate('/')
    const event = new MouseEvent('click', { button: 1, cancelable: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    onLinkClick(event, '/tasks/3')
    expect(preventDefaultSpy).not.toHaveBeenCalled()
    expect(window.location.pathname).toBe('/')
  })
})
