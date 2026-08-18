import type { Task, TaskFilters, TaskStatus } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

interface TaskApiResponse {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  assignee_id: number | null
  created_at: string
  updated_at: string
}

function mapTask(raw: TaskApiResponse): Task {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    assigneeId: raw.assignee_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function fetchTasks(filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams()
  if (filters?.status) {
    params.set('status', filters.status)
  }
  if (filters?.assigneeId != null) {
    params.set('assignee_id', String(filters.assigneeId))
  }
  const query = params.toString()

  const response = await fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`)
  if (!response.ok) {
    throw new Error(`Failed to load tasks: ${response.status}`)
  }
  const raw: TaskApiResponse[] = await response.json()
  return raw.map(mapTask)
}
