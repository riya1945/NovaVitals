import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (key) => req.cookies.get(key)?.value } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuth = !!user;
  const isLoginPage = req.nextUrl.pathname === "/";

  // If user is not logged in, redirect to login page
  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If logged in and tries to go to login, redirect to /home
  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return res;
}

// Protect all routes except static files & API
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
