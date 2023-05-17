import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const candlesRouter = router({
  getByTicker: protectedProcedure
    .input(z.object({ ticker: z.string(), limit: z.number().optional() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.candles.findMany({
        where: {
          ticker: {
            equals: input.ticker,
          },
          open: {
            not: 0,
          },
          close: {
            not: 0,
          },
        },
        orderBy: {
          date: "desc",
        },
        take: input.limit,
      });
    }),
});
