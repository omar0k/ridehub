// API
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
    test:publicProcedure.query(()=>{
        return "hello trpc"
    })
});

export type AppRouter = typeof appRouter;
