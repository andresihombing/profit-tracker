import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const publicPaths = new Set(["/login", "/register"]);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.has(pathname);
  const isAuthenticated = Boolean(request.auth?.user);

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && publicPaths.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
