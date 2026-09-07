import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/session";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!isValidSessionToken(token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons).*)",
  ],
};
