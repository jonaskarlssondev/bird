import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const candlesRouter = router({
  getByTicker: protectedProcedure
    .input(z.object({ ticker: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.candles.findMany({
        where: {
          ticker: {
            equals: input.ticker,
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    }),
});
