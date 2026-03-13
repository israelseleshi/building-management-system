import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "am"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect /en or /am to root / with the cookie set
  if (SUPPORTED_LOCALES.includes(pathname.replace(/^\/|\/$/g, ''))) {
    const locale = pathname.replace(/^\/|\/$/g, '');
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  // 2. Handle missing locale cookie on root/other paths
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "am";
  const response = NextResponse.next();
  
  if (!request.cookies.has("NEXT_LOCALE")) {
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
