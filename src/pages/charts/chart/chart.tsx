import { candles } from "@prisma/client";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import ChartFrame from "./chartFrame";

const Chart: React.FC<{ ticker: string }> = (props) => {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) {
    return <></>;
  }

  const { data, status } = trpc.candles.getByTicker.useQuery({
    ticker: props.ticker,
    limit: 100,
  });

  if (status === "loading") {
    return <></>;
  }

  if (data) {
    const maxHeight = 500;

    const maxY = Math.max(...data.map((x) => x.high));
    const minY = Math.max(0, Math.min(...data.map((x) => x.low)));

    // Pixels Per Currency - Computes the number of pixels per currency unit.
    // If a security has moved 500 e.g. dollars in the timespan - then each dollar would be represented by 1 pixel.
    const ppc = maxHeight / (maxY - minY);

    return (
      <div className="flex-1 flex-col rounded border border-solid border-dark-secondary p-2">
        <ChartFrame title={props.ticker} candles={data}>
          {data.map((c) => (
            <Candle key={c.id} candle={c} factor={ppc} max={maxY} />
          ))}
        </ChartFrame>
      </div>
    );
  }

  return (
    <div className="flex h-max flex-col rounded border border-solid border-dark-secondary">
      No data
    </div>
  );
};

export default Chart;

const Candle: React.FC<{
  candle: candles;
  max: number;
  factor: number;
}> = (props) => {
  const thinHeightCalc = (props.candle.high - props.candle.low) * props.factor;
  const thinMarginTop = (props.max - props.candle.high) * props.factor;
  const thinStyle = {
    height: thinHeightCalc + "px",
    marginTop: thinMarginTop + "px",
  };

  const thickHeightCalc =
    Math.abs(props.candle.open - props.candle.close) * props.factor;
  const thickMarginTop =
    (props.candle.high -
      (props.candle.open > props.candle.close
        ? props.candle.open
        : props.candle.close)) *
    props.factor;
  const thickStyle = {
    height: thickHeightCalc + "px",
    marginTop: thickMarginTop - thinHeightCalc + "px",
  };

  const inc = props.candle.close > props.candle.open;
  const bg = inc ? "bg-green-800 " : "bg-red-800 ";

  return (
    <div style={thinStyle}>
      <div className={bg + " ml-1 h-full w-0.5"}></div>
      <div style={thickStyle} className={bg + " ml-0.5 w-1.5"}></div>
    </div>
  );
};
