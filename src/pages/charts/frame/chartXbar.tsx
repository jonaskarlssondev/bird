import type { candles } from "@prisma/client";

const ChartXbar: React.FC<{ candles: candles[]; ppc: number }> = (props) => {
  if (props.candles.length === 0 || !props.candles[0]) {
    return <></>;
  }

  const format = new Intl.DateTimeFormat("en", { month: "short" });
  let currMonth = format.format(props.candles[0].date);

  return (
    <div className="flex flex-row-reverse pr-[84px] text-xs text-slate-400">
      {props.candles.map((c, i) => {
        const month = format.format(c.date);
        if (month !== currMonth) {
          const display = currMonth;
          currMonth = month;

          return (
            <div
              key={i}
              className="absolute flex w-px flex-col"
              style={{ marginRight: 8 * i + "px" }}
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

export default ChartXbar;
