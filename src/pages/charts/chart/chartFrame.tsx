import type { candles } from "@prisma/client";
import type { ReactNode } from "react";
import CurrentPrice from "../components/currentPrice";

const ChartFrame: React.FC<{
  candles: candles[];
  title: string;
  children: ReactNode;
}> = (props) => {
  const maxHeight = 500;
  const padding = 48;
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
        <div className="flex w-full flex-row-reverse overflow-x-hidden border-b-2 border-r-2 border-solid border-dark-secondary pr-2.5 pt-12 pb-12">
          {props.children}
        </div>
        <div className="h-fill flex w-20 flex-col overflow-y-hidden pt-12 pb-12">
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

const ChartXbar: React.FC<{ candles: candles[]; ppc: number }> = (props) => {
  if (props.candles.length === 0 || !props.candles[0]) {
    return <></>;
  }

  const format = new Intl.DateTimeFormat("en", { month: "short" });
  let currMonth = format.format(props.candles[0].date);

  return (
    <div className="flex flex-row-reverse pr-20 text-xs text-slate-400">
      {props.candles.map((c, i) => {
        const month = format.format(c.date);
        if (month !== currMonth) {
          const display = currMonth;
          currMonth = month;

          return (
            <div
              key={i}
              className="absolute flex w-px flex-col"
              style={{ marginRight: 8 * (i + 1) + "px" }}
            >
              <div className="h-2 bg-slate-400"></div>
              <p className="mt-px ml-[-10px] text-xs text-slate-400">
                {display}
              </p>
            </div>
          );
        }
      })}
    </div>
  );
};

const ChartYbar: React.FC<{
  renderHeight: number;
  padding: number;
  ppc: number;
  max: number;
  min: number;
  children: ReactNode;
}> = (props) => {
  const yDiff = props.max - props.min;

  // Divide by 5 -> multiply by five will round to closest 5. E.g. 5,10,15.
  // Divide by an additional 5 because thats an arbitrarily chosen number which yields a
  // reasonable distance between range dividers.
  const delta = Math.round(yDiff / 25) * 5;

  // Round highest value down to closest delta
  const highest = Math.floor(props.max / delta) * delta;

  const marginTopPrice = (props.max - (highest + delta)) * props.ppc;

  return (
    <>
      {props.children}
      {marginTopPrice + props.padding > 0 ? (
        <div
          style={{ marginTop: marginTopPrice + "px" }}
          className="absolute flex flex-row"
        >
          <div className="h-px w-2 bg-slate-400"></div>
          <p className="ml-1 mt-[-7px] text-xs text-slate-400">
            {highest + delta}
          </p>
        </div>
      ) : (
        <></>
      )}
      {Array.from({ length: 6 }, (_, i) => highest - i * delta).map((v, i) => {
        const margin = (props.max - v) * props.ppc;

        if (margin < props.renderHeight) {
          const style = {
            marginTop: margin + "px",
          };

          return (
            <div key={i} style={style} className="absolute flex flex-row">
              <div className="h-px w-2 bg-slate-400"></div>
              <p className="ml-1 mt-[-7px] text-xs text-slate-400">{v}</p>
            </div>
          );
        }
      })}
    </>
  );
};
