import { ref } from 'vue'

export type Route = { name: 'list' } | { name: 'task-detail'; id: number }

export function parseLocation(): Route {
  const match = window.location.pathname.match(/^\/tasks\/(\d+)$/)
  return match ? { name: 'task-detail', id: Number(match[1]) } : { name: 'list' }
}

export const currentRoute = ref<Route>(parseLocation())

export function navigate(path: string): void {
  history.pushState(null, '', path)
  currentRoute.value = parseLocation()
}

window.addEventListener('popstate', () => {
  currentRoute.value = parseLocation()
})

export function onLinkClick(event: MouseEvent, path: string): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return
  }
  event.preventDefault()
  navigate(path)
}
