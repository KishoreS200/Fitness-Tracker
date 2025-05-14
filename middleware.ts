import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the user is logged in - check both cookie and URL to avoid redirect loops
  const isLoggedIn = request.cookies.has("userEmail")
  console.log("Middleware - isLoggedIn:", isLoggedIn)

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/test-login"]

  // Get the current path
  const { pathname } = request.nextUrl
  console.log("Middleware - current path:", pathname)

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    console.log("Middleware - redirecting to login")
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // If the user is logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && publicRoutes.includes(pathname)) {
    console.log("Middleware - redirecting to dashboard")
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  console.log("Middleware - allowing navigation")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
