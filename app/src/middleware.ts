// Rate limiting：依賴 Vercel 內建 DDoS 防護與 Supabase 自帶限流。
// 若未來需要更精細的 API 限流，可考慮 Upstash Redis（@upstash/ratelimit）。
import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // API routes 不做 locale 處理
  if (request.nextUrl.pathname.startsWith("/api")) {
    return await updateSession(request);
  }

  // 先執行 Supabase session 更新（設定 cookies）
  const supabaseResponse = await updateSession(request);

  // 若 Supabase middleware 回傳 redirect（auth 保護），直接回傳
  if (supabaseResponse.headers.get("location")) {
    return supabaseResponse;
  }

  // 執行 next-intl locale 處理
  const intlResponse = intlMiddleware(request);

  // 將 Supabase 設定的 cookies 複製到 intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|lottie|json|txt|xml)$).*)",
  ],
};
