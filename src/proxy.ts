// proxy.ts
import type { NextRequest } from "next/server"
import { updateSession } from "@/app/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  // redirect if no valid session
  
  return updateSession(request)
}

export const config = {
  matcher: [
    // run Proxy for “real” app routes; tweak as you like
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
