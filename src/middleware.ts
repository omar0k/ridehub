import { authMiddleware } from "@clerk/nextjs";
import {} from "@clerk/nextjs/server"
export default authMiddleware({
  publicRoutes: [
    "/api/webhooks(.*)",
    "/",
    "/fleet",
    "/api/trpc/getVehicles",
    "/api/trpc/createTrip",
    "/api/trpc/createStripeSession",
    "/payment-successful/(.*)",
    "/api/trpc/getTrip",
  ],
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
