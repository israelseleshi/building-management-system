// __mocks__/supabaseClient.ts
import { vi } from "vitest";

type AuthResponse = { error: null } | { error: { message: string } };

export const supabase = {
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({ error: null } as AuthResponse),
    signUp: vi.fn().mockResolvedValue({ error: null } as AuthResponse),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => Promise.resolve({ data: [], error: null })),
  })),
};
