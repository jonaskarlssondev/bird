import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const watchlistRouter = router({
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

  deleteWatchlist: protectedProcedure
    .input(z.object({ watchlistId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchlist.deleteMany({
        where: {
          id: input.watchlistId,
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

  deleteTicker: protectedProcedure
    .input(z.object({ tickerId: z.string(), watchlistId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.watchlistTicker.deleteMany({
        where: {
          id: input.tickerId,
          watchlistId: input.watchlistId,
        },
      });
    }),
});
