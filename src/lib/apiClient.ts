const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "")

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
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  })

  const data = (await response.json().catch(() => ({}))) as T

  if (!response.ok) {
    throw Object.assign(new Error("API request failed"), {
      status: response.status,
      data,
    })
  }

  return data
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const data = (await response.json().catch(() => ({}))) as T

  if (!response.ok) {
    throw Object.assign(new Error("API request failed"), {
      status: response.status,
      data,
    })
  }

  return data
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
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
    ...init,
  })

  const data = (await response.json().catch(() => ({}))) as T

  if (!response.ok) {
    throw Object.assign(new Error("API request failed"), {
      status: response.status,
      data,
    })
  }

  return data
}
