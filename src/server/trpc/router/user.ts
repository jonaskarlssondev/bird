import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getWatchLists: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.watchlist.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          tickers: true,
        },
      });
    }),

  getWatchlist: protectedProcedure
    .input(z.object({ watchListId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.watchlist.findUnique({
        where: {
          id: input.watchListId,
        },
        include: {
          tickers: true,
        },
      });
    }),
});
