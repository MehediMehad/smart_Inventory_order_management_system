// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/Auth";

type Role = "ADMIN" | "GENERAL_ADMIN" | "MODERATOR" | "USER";

// Routes that logged in users should NOT access
const loginUserNotAllowedRoutes = ["/login", "/register", "/verify-otp", "/forgot-password"];

// Public routes (everyone can access)
const publicRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
  "/terms-and-conditions",
];

// Role-based login redirects
const roleBasedLoginRedirects: Record<Role, string> = {
  USER: "/",
  ADMIN: "/dashboard",
  GENERAL_ADMIN: "/dashboard",
  MODERATOR: "/dashboard",
};

// Role-based allowed routes
const roleBasedPrivateRoutes: Record<Role, string[]> = {
  USER: [
    '/',
    '/profile',
    '/profile/edit',
    '/products',
    '/products/details/*',
  ],
  ADMIN: [
    '/about-us',
    '/reset-password',
    '/dashboard',
    '/dashboard/user-menage',
    '/dashboard/workout-menage',
    '/dashboard/workout-menage/create',
    '/dashboard/workout-menage/edit/*',
    '/dashboard/workout-menage/details/*',
    '/dashboard/workout-menage/add-exercise/*',
    '/dashboard/verse-menage',
    '/dashboard/verse-menage/create',
    '/dashboard/verse-menage/edit/*',
    '/dashboard/verse-menage/details/*',
    '/dashboard/meal-cards',
    '/dashboard/meal-cards/create',
    '/dashboard/meal-cards/edit/*',
    '/dashboard/meal-cards/details/*',
    '/dashboard/add-faq',
    '/dashboard/privacy-policy',
    '/dashboard/privacy-policy/update',
    '/dashboard/terms-and-service',
    '/dashboard/terms-and-service/update',
  ],
  GENERAL_ADMIN: [
    '/',
    '/profile',
    '/profile/edit',
    '/dashboard',
    '/dashboard/user-manage',
    '/dashboard/user-manage/details/*',
    '/dashboard/products',
    '/dashboard/products/details/*',
  ],
  MODERATOR: [
    '/',
    '/profile',
    '/profile/edit',
    '/dashboard',
    '/dashboard/products',
    '/dashboard/products/details/*',
  ],
};

// Helper to check if a path matches any pattern
const isPathMatch = (path: string, patterns: string[]) => {
  return patterns.some(pattern => {
    if (pattern.endsWith("/*")) {
      const base = pattern.replace("/*", "");
      return path.startsWith(base);
    }
    return path === pattern;
  });
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const userInfo = await getCurrentUser();
  const userRole = userInfo?.role as Role | undefined;

  // console.log("user role 🩸", userInfo, userRole);


  // If user is NOT logged in
  if (!userInfo || !userRole) {
    if (!isPathMatch(pathname, publicRoutes)) {
      return NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, request.url)
      );
    }
    // allow public routes
    return NextResponse.next();
  }

  // If logged-in user tries to access login/register pages
  if (isPathMatch(pathname, loginUserNotAllowedRoutes)) {
    const redirectTo = roleBasedLoginRedirects[userRole] || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Check role-based private routes
  const allowedRoutes = roleBasedPrivateRoutes[userRole] || [];
  if (!isPathMatch(pathname, allowedRoutes)) {
    // redirect to default dashboard/home for that role
    const redirectTo = roleBasedLoginRedirects[userRole] || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // All checks passed, continue request
  return NextResponse.next();
};

// Matcher for Next.js middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|/api/|/assets/).*)",
  ],
};