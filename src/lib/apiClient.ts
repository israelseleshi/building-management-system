const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "")

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export type ApiError = {
  error?: string
  message?: string
  success?: false
}

const readCookie = (name: string) => {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null
}

export const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken") || readCookie("authToken")
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  })

  const text = await response.text()
  let data: any
  try {
    data = text ? JSON.parse(text) : {}
  } catch (e) {
    console.error(`Failed to parse JSON from ${path}:`, text)
    throw new Error(`Invalid JSON response from ${path}`)
  }

  if (!response.ok) {
    throw Object.assign(new Error(data?.message || data?.error || "API request failed"), {
      status: response.status,
      data,
    })
  }

  return data as T
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const text = await response.text()
  let data: any
  try {
    data = text ? JSON.parse(text) : {}
  } catch (e) {
    console.error(`Failed to parse JSON from ${path}:`, text)
    throw new Error(`Invalid JSON response from ${path}`)
  }

  if (!response.ok) {
    throw Object.assign(new Error(data?.message || data?.error || "API request failed"), {
      status: response.status,
      data,
    })
  }

  return data as T
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  })

  const text = await response.text()
  let data: any
  try {
    data = text ? JSON.parse(text) : {}
  } catch (e) {
    console.error(`Failed to parse JSON from ${path}:`, text)
    throw new Error(`Invalid JSON response from ${path}`)
  }

  if (!response.ok) {
    throw Object.assign(new Error(data?.message || data?.error || "API request failed"), {
      status: response.status,
      data,
    })
  }

  return data as T
}
