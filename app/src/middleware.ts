// Rate limiting：依賴 Vercel 內建 DDoS 防護與 Supabase 自帶限流。
// 若未來需要更精細的 API 限流，可考慮 Upstash Redis（@upstash/ratelimit）。
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
