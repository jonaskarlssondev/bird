import { router } from "../trpc";
import { candlesRouter } from "./candles";
import { userRouter } from "./user";
import { watchlistRouter } from "./watchlist";

export const appRouter = router({
  candles: candlesRouter,
  watchlist: watchlistRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
