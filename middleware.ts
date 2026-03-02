import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = new Set(["en", "am"]);

export default function middleware(request: NextRequest) {
  const hasLocaleCookie = request.cookies.get("NEXT_LOCALE")?.value;

  if (hasLocaleCookie && SUPPORTED_LOCALES.has(hasLocaleCookie)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", "am", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
