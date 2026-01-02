/// <reference types="vitest/globals" />
import { vi, beforeAll } from "vitest";
import "@testing-library/jest-dom";

// Polyfill fetch if running in Node < 18
import "cross-fetch/polyfill";

// Mock Next.js navigation hooks
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "",
}));

// Silence console.error for React act warnings during tests
beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((msg: unknown) => {
    const text = String(msg);
        if (/(act\(\)|Warning: \w+)/.test(text)) return;
    // @ts-ignore
    console._errorOriginal?.(msg);
  });
});
