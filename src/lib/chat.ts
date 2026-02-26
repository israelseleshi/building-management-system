import { API_BASE_URL, getAuthToken } from "./apiClient"

export async function getOrCreateConversation(_currentUserId: string, otherUserId: string) {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      participantIds: [otherUserId]
    })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Failed to get or create conversation")
  
  return { id: data.data.conversation.conversation_id }
}
