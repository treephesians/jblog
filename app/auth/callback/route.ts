import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    try {
      const pendingCookies: { name: string; value: string; options: Partial<ResponseCookie> }[] = [];

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
              pendingCookies.push(...cookiesToSet);
            },
          },
        }
      );

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const redirectTo = request.cookies.get("loginRedirect")?.value ?? "/";
        const response = NextResponse.redirect(`${origin}${redirectTo}`);

        pendingCookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        response.cookies.delete("loginRedirect");

        return response;
      }

      console.error("[auth/callback] exchangeCodeForSession error:", error);
    } catch (e) {
      console.error("[auth/callback] exception:", e);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
