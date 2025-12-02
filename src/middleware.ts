// middleware.ts  (project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./app/lib/supabase/server"


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that should NOT redirect
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if(pathname === "/api") {
    // check if user exists, otherwise dont let the api be called
    if(!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return res;
}

// Run middleware on everything; we decide inside what is public/protected
export const config = {
  matcher: ["/(.*)"],
};
