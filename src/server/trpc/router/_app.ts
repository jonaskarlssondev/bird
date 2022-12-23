import { router } from "../trpc";
import { candlesRouter } from "./candles";
import { userRouter } from "./user";

export const appRouter = router({
  candles: candlesRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
