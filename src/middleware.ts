import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextResponse } from "next/server";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
});

export default function middleware(req: NextRequestWithAuth) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/users", req.url));
  }

  return authMiddleware(req, {} as NextFetchEvent);
}
