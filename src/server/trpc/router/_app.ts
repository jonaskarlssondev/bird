import { router } from "../trpc";
import { authRouter } from "./auth";
import { candlesRouter } from "./candles";

export const appRouter = router({
  auth: authRouter,
  candles: candlesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
