// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/topic/:path*",
    "/quiz/:path*",
    "/result/:path*",
    "/admin/:path*",
  ],
};
