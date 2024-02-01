import { useUser } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server/unstable-core-do-not-import";

const t = initTRPC.create();
const middlware = t.middleware;

const isAuth = middlware(async (opts) => {
  const { user } = useUser();
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;
