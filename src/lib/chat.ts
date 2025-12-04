import { supabase } from "./supabaseClient"

export async function getOrCreateConversation(currentUserId: string, otherUserId: string) {
  // 1) find all conversations where current user participates
  const { data: myCps, error: myCpError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", currentUserId)

  if (myCpError) throw myCpError
  if (!myCps || myCps.length === 0) {
    // no conversations yet; create fresh one
    return await createConversation(currentUserId, otherUserId)
  }

  const convIds = myCps.map((cp) => cp.conversation_id as string)

  // 2) see if any of those conversations also contains otherUserId
  const { data: existing, error: existingError } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .in("conversation_id", convIds)
    .eq("user_id", otherUserId)
    .maybeSingle()

  if (existingError && existingError.code !== "PGRST116") {
    // PGRST116 = no rows
    throw existingError
  }

  if (existing && existing.conversation_id) {
    return { id: existing.conversation_id as string }
  }

  // 3) create new 1:1 conversation
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
