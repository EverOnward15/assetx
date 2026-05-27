import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes
  if (pathname === "/" || pathname === "/signup") {
    return NextResponse.next();
  }

  // ✅ Protect dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};