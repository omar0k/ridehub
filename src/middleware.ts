import { authMiddleware } from "@clerk/nextjs";

export const config = {
  matcher: ["/dashboard/:path*"],
};
export default authMiddleware({
  async handler(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Authenticated" }));
  },
});
