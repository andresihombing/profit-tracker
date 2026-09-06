import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicPaths = new Set(["/login"]);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.has(pathname);
  const isAuthenticated = Boolean(request.auth?.user?.id);

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
