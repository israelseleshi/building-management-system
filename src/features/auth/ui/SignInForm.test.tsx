import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "./SignInForm";

test("calls login endpoint on submit", async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { user: { role: "tenant" }, token: "t" } }),
  });

  // @ts-expect-error - override for test
  global.fetch = fetchMock;

  render(<SignInForm />);
  await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
  await userEvent.type(screen.getByLabelText(/^password/i), "secret123");
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringMatching(/\/auth\/login$/),
    expect.objectContaining({
      method: "POST",
    })
  );
});
