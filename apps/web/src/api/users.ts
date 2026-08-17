import type { User } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`)
  if (!response.ok) {
    throw new Error(`Failed to load users: ${response.status}`)
  }
  return response.json()
}
