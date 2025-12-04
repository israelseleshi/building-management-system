import { supabase } from "./supabaseClient"

export async function getOrCreateConversation(currentUserId: string, otherUserId: string) {
  // Look for any existing 1:1 conversation that already has BOTH users
  // as participants, regardless of who started it.
  const { data: cps, error: cpError } = await supabase
    .from("conversation_participants")
    .select("conversation_id, user_id")
    .in("user_id", [currentUserId, otherUserId])

  if (cpError) throw cpError

  if (cps && cps.length > 0) {
    const byConversation = new Map<string, Set<string>>()

    for (const row of cps as any[]) {
      const convId = row.conversation_id as string
      const uid = row.user_id as string
      if (!byConversation.has(convId)) {
        byConversation.set(convId, new Set())
      }
      byConversation.get(convId)!.add(uid)
    }

    const existingEntry = Array.from(byConversation.entries()).find(
      ([, userSet]) => userSet.has(currentUserId) && userSet.has(otherUserId)
    )

    if (existingEntry) {
      return { id: existingEntry[0] }
    }
  }

  // No existing shared conversation found -> create new 1:1 conversation
  return await createConversation(currentUserId, otherUserId)
}

async function createConversation(currentUserId: string, otherUserId: string) {
  const { data: conv, error: convError } = await supabase
    .from("conversations")
    .insert({ is_group: false, status: "active" })
    .select("id")
    .single()

  if (convError) throw convError

  const { error: cpError } = await supabase.from("conversation_participants").insert([
    {
      conversation_id: conv.id,
      user_id: currentUserId,
    },
    {
      conversation_id: conv.id,
      user_id: otherUserId,
    },
  ])

  if (cpError) throw cpError

  return { id: conv.id as string }
}
