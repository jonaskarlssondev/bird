import type { candles } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useWindowDimensions } from "../../utils/hooks";
import CurrentPrice from "../components/currentPrice";
import Volume from "../components/volume";
import ChartXbar from "../frame/chartXbar";
import ChartYbar from "../frame/chartYbar";

const Chart: React.FC<{ ticker: string }> = (props) => {
    const size = useWindowDimensions();
    
    const limit = Math.floor((size.width - 92) / 6);

    const { data, status } = trpc.candles.getByTicker.useQuery({
        ticker: props.ticker,
        limit: limit,
    });

    if (status === "loading") {
        return <></>;
    }

    if (!data || data.length === 0) {   
        return (
            <div className="w-full min-h-12 p-1 bg-dark-primary border border-dark-secondary rounded">
                <div className="h-64 flex items-center justify-center">
                    No data available
                </div>
            </div>
        );
    }

    const height = () => {
        const init = size.width * 0.5;
        return Math.max(250, Math.min(init, size.height*0.6))
    }

    const maxHeight = height()-24-48;

    const maxY = Math.max(...data.map((x) => x.high));
    const minY = Math.max(0, Math.min(...data.map((x) => x.low)));

    // Pixels Per Currency - Computes the number of pixels per currency unit.
    // If a security has moved 500 e.g. dollars in the timespan - then each dollar would be represented by 1 pixel.
    const ppc = maxHeight / (maxY - minY);

    return (
        <div className="w-full min-h-12 p-1 bg-dark-primary border border-dark-secondary rounded">
            <div className="grid grid-cols-[auto_60px] grid-rows-[auto_30px]">
                <section className="h-[50vw] min-h-[250px] max-h-[60vh] pr-[6px] overflow-hidden">
                    <div className="flex flex-row-reverse pt-4 pb-2">
                        {data.map((c) => (
                            <Candle key={c.id} candle={c} factor={ppc} max={maxY} />
                        ))}
                    </div>
                    <Volume data={data.map((x) => Number(x.volume))} />
                </section>
                <section className="pt-4 pb-2 border-l border-dark-secondary">
                    <ChartYbar
                      renderHeight={height()-24}
                      padding={16}
                      ppc={ppc}
                      max={maxY}
                      min={minY}
                    >
                        <CurrentPrice
                            price={data[0]?.close}
                            ppc={ppc}
                            max={maxY}
                        />
                    </ChartYbar>
                </section>
                <section className="pr-[6px] border-t border-dark-secondary">
                    <ChartXbar candles={data} />
                </section>
            </div>
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

  const [showDetails, setShowDetails] = useState(false);

  const inc = props.candle.close > props.candle.open;
  const bg = showDetails ? "bg-white" : inc ? "bg-green-800 " : "bg-red-800 ";

  return (
    <div>
      <div
        style={thinStyle}
        onMouseOver={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <div className={bg + " ml-[3px] h-full w-[1px]"}></div>
        <div style={thickStyle} className={bg + " ml-[1px] w-[5px]"}></div>
      </div>

      {showDetails && <CandleDetails candle={props.candle} />}
    </div>
  );
};

const CandleDetails: React.FC<{candle: candles}> = (props) => {
    return (
        <div className="absolute z-10 mt-1 rounded bg-gray-600 p-1 text-xs text-slate-400">
        <p>Date: {props.candle.date.toLocaleDateString('sv-SE')}</p>
          <p>
            Open: {Math.round((props.candle.open + Number.EPSILON) * 100) / 100}
          </p>
          <p>
            High: {Math.round((props.candle.high + Number.EPSILON) * 100) / 100}
          </p>
          <p>
            Low: {Math.round((props.candle.low + Number.EPSILON) * 100) / 100}
          </p>
          <p>
            Close:{" "}
            {Math.round((props.candle.close + Number.EPSILON) * 100) / 100}
          </p>
          <p>Volume: {Number(props.candle.volume)}</p>
        </div>
    );
}
