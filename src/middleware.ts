import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/webhooks(.*)"],
});
export const config = {
  matcher: ["/dashboard(.*)"],
};
