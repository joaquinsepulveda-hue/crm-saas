import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const ONBOARDING_ROUTES = ["/onboarding/workspace", "/onboarding/team", "/onboarding/import"];
const SKIP_PREFIXES = ["/_next/static", "/_next/image", "/favicon.ico", "/api/webhooks", "/api/v1", "/api/onboarding", "/api/billing", "/api/ai", "/api/auth", "/api/cron"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isOnboardingRoute = ONBOARDING_ROUTES.some((r) => pathname.startsWith(r));

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && !isOnboardingRoute && !isPublicRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_complete) {
      return NextResponse.redirect(new URL("/onboarding/workspace", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
