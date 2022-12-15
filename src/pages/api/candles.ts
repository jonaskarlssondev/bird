import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const allCandles = async (req: NextApiRequest, res: NextApiResponse) => {
  const candles = await prisma.candles.findMany();
  res.status(200).json(candles);
};

export default allCandles;
