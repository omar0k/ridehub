import { auth, useUser } from "@clerk/nextjs";
import { TRPCError, initTRPC } from "@trpc/server/unstable-core-do-not-import";

const t = initTRPC.create();
const middlware = t.middleware;

const isAuth = middlware(async (opts) => {
  const { userId } = auth();
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      userId: userId,
    },
  });
});
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
