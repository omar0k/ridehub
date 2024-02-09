import { authMiddleware } from "@clerk/nextjs";

export const config = {
  matcher: ["/dashboard/:path*"],
};
export default authMiddleware;
