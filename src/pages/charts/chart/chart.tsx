import { candles } from "@prisma/client";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";

const Chart: React.FC<{ ticker: string }> = (props) => {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) {
    return <></>;
  }

  const { data, status } = trpc.candles.getByTicker.useQuery({
    ticker: props.ticker,
  });

  if (status === "loading") {
    return <></>;
  }

  if (data) {
    return (
      <div className="flex-1 flex-col rounded border border-solid border-dark-secondary p-2">
        <ChartFrame ticker={props.ticker} candles={data} />
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

const ChartFrame: React.FC<{ candles: candles[]; ticker: string }> = (
  props
) => {
  const maxY = Math.max(...props.candles.map((x) => x.high));
  const minY = Math.max(0, Math.min(...props.candles.map((x) => x.low)));

  const factor = 500 / (maxY - minY);

  return (
    <div className="flex h-full min-h-[250px] w-full flex-col items-center">
      <div>{props.ticker}</div>
      <div className="flex w-full">
        <div className="flex w-full flex-row-reverse overflow-x-hidden border-b-2 border-r-2 border-solid border-dark-secondary pr-2.5 pt-12 pb-12">
          {props.candles.map((c) => (
            <Candle key={c.id} candle={c} factor={factor} max={maxY} />
          ))}
        </div>
        <div className="h-content w-12"></div>
      </div>
      <div className="w-content h-12"></div>
    </div>
  );
};

const Candle: React.FC<{
  candle: candles;
  max: number;
  factor: number;
}> = (props) => {
  const thinHeightCalc = Math.round(
    (props.candle.high - props.candle.low) * props.factor
  );
  const thinMarginTop = Math.round(
    (props.max - props.candle.high) * props.factor
  );

  const thinStyle = {
    height: thinHeightCalc + "px",
    marginTop: thinMarginTop + "px",
  };

  const thickHeightCalc = Math.round(
    Math.abs(props.candle.open - props.candle.close) * props.factor
  );
  const thickMarginTop = Math.round(
    (props.candle.high -
      (props.candle.open > props.candle.close
        ? props.candle.open
        : props.candle.close)) *
      props.factor
  );

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
