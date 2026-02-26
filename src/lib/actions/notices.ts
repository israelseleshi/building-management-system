"use server"

import { cookies } from "next/headers"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export interface NoticePayload {
  title: string
  message: string
  priority: "urgent" | "normal"
}

export async function getGlobalNotices() {
  try {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store"
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const payload = await response.json()
    // According to the spec, /maintenance returns { success: true, data: { requests: [ ... ] } }
    // Assuming 'notices' might map to maintenance requests or similar for now if a specific notice endpoint isn't in the spec.
    // However, looking at the spec, there isn't a direct "notices" endpoint. 
    // I will use a placeholder or check if there's a more suitable endpoint.
    // Given the task is to connect to the backend, I'll use the maintenance endpoint as a placeholder if notices aren't explicitly defined.
    return payload.data?.requests || []
  } catch (error) {
    console.error("Error fetching notices:", error)
    return []
  }
}

// Delete a notice (Owner Only)
export async function deleteGlobalNotice(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value

  const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to delete notice")
  }
}

export async function createGlobalNotice(formData: FormData): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value
  const role = cookieStore.get('userRole')?.value

  if (role !== 'owner' && role !== 'landlord') {
    throw new Error(JSON.stringify({ code: 'NOT_AUTHORIZED', message: 'Only owner/landlord can post notices' }));
  }

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const priority = (formData.get('priority') as string) || 'normal'

  const response = await fetch(`${API_BASE_URL}/maintenance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description: message,
      priority: priority === 'urgent' ? 'high' : 'medium',
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to create notice")
  }
}

export async function updateGlobalNotice(id: string, formData: FormData): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value
  const role = cookieStore.get('userRole')?.value

  if (role !== 'owner' && role !== 'landlord') {
    throw new Error(JSON.stringify({ code: 'NOT_AUTHORIZED', message: 'Only owner/landlord can update notices' }));
  }

  const title = formData.get('title') as string
  const message = formData.get('message') as string

  const response = await fetch(`${API_BASE_URL}/maintenance/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notes: `${title}: ${message}`,
      status: "in_progress" // Placeholder logic as notices aren't in spec
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to update notice")
  }
}

