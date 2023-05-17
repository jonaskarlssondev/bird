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
  const minY = Math.max(
    0,
    Math.min(...props.candles.filter((x) => x.low !== 0).map((x) => x.low))
  );

  // Pixels Per Currency - Computes the number of pixels per currency unit.
  // If a security has moved 500 e.g. dollars in the timespan - then each dollar would be represented by 1 pixel.
  const ppc = maxHeight / (maxY - minY);

  console.log("maxY: " + maxY);
  console.log("minY: " + minY);
  console.log("ppc: " + ppc);

  return (
    <div className="flex h-full min-w-[500px] flex-col items-center">
      <div>{props.title}</div>
      <div className="flex w-full">
        <ContentOrEmptyMessage
          showEmpty={!props.candles || props.candles.length === 0}
        >
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
        </ContentOrEmptyMessage>
      </div>
      <div className="h-12 w-full">
        <ChartXbar candles={props.candles} ppc={6}></ChartXbar>
      </div>
    </div>
  );
};

const ContentOrEmptyMessage: React.FC<{
  children: ReactNode;
  showEmpty: boolean;
}> = (props) => {
  if (props.showEmpty) {
    return (
      <div className="flex w-full items-center justify-center pt-14 pb-16 text-xs text-slate-400">
        No data available
      </div>
    );
  }

  return <>{props.children}</>;
};

export default ChartFrame;
