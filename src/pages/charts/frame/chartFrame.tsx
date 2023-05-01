import type { candles } from "@prisma/client";
import type { ReactNode } from "react";
import CurrentPrice from "../components/currentPrice";
import ChartXbar from "./chartXbar";
import ChartYbar from "./chartYbar";

const ChartFrame: React.FC<{
  candles: candles[];
  title: string;
  children: ReactNode;
}> = (props) => {
  const maxHeight = 500;
  const padding = 16;
  const textSize = 16;

  const maxY = Math.max(...props.candles.map((x) => x.high));
  const minY = Math.max(0, Math.min(...props.candles.map((x) => x.low)));

  // Pixels Per Currency - Computes the number of pixels per currency unit.
  // If a security has moved 500 e.g. dollars in the timespan - then each dollar would be represented by 1 pixel.
  const ppc = maxHeight / (maxY - minY);

  return (
    <div className="flex h-full min-h-[250px] flex-col items-center">
      <div>{props.title}</div>
      <div className="flex w-full">
        <div className="flex w-full flex-col overflow-x-hidden border-b-2 border-r-2 border-solid border-dark-secondary pr-2.5">
          {props.children}
        </div>
        <div className="h-fill flex w-20 flex-col overflow-y-hidden pt-6 pb-6">
          <ChartYbar
            renderHeight={maxHeight + padding - textSize / 2}
            padding={padding}
            ppc={ppc}
            max={maxY}
            min={minY}
          >
            <CurrentPrice
              price={props.candles[0]?.close}
              ppc={ppc}
              max={maxY}
            />
          </ChartYbar>
        </div>
      </div>
      <div className="h-12 w-full">
        <ChartXbar candles={props.candles} ppc={6}></ChartXbar>
      </div>
    </div>
  );
};

export default ChartFrame;
