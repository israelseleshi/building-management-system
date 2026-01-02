import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => {
  const supabase = {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  };
  return { supabase };
});
import userEvent from "@testing-library/user-event";

// Vitest automatically uses the __mocks__/supabaseClient.ts file
import { supabase } from "@/lib/supabaseClient";
import { SignInForm } from "./SignInForm";

test("calls supabase.auth.signInWithPassword on submit", async () => {
  render(<SignInForm />);
  await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
  await userEvent.type(screen.getByLabelText(/^password/i), "secret123");
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: "user@example.com",
    password: "secret123",
  });
});