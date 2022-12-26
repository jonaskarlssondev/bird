import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getWatchlist: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.watchlist.findFirst({
        where: {
          userId: input.userId,
        },
        include: {
          tickers: true,
        },
      });
    }),

  createWatchlist: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchlist.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),

  addTicker: protectedProcedure
    .input(z.object({ watchlistId: z.string(), ticker: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchlistTicker.create({
        data: {
          ticker: input.ticker,
          watchlistId: input.watchlistId,
        },
      });
    }),

  removeTicker: protectedProcedure
    .input(z.object({ tickerId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchlistTicker.delete({
        where: {
          id: input.tickerId,
        },
      });
    }),
});
