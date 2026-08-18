export type TaskStatus = 'new' | 'in_progress' | 'in_review' | 'done'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  assigneeId: number | null
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  name: string
  email: string
}

export interface TaskFilters {
  status: TaskStatus | null
  assigneeId: number | null
}
