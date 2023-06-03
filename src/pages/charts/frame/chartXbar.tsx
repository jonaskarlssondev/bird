import type { candles } from "@prisma/client";

const ChartXbar: React.FC<{ candles: candles[]; }> = (props) => {
  if (props.candles.length === 0 || !props.candles[0]) {
    return <></>;
  }

  const monthFmt = new Intl.DateTimeFormat("en", { month: "short" });
  let currMonth = monthFmt.format(props.candles[0].date);

  return (
    <div className="flex flex-row-reverse overflow-x-hidden text-xs text-slate-400">
      {props.candles.map((c, i) => {
        const month = monthFmt.format(c.date);

        if (month !== currMonth) {
          const display = currMonth;
          currMonth = month;          

          return (
            <div
              key={i}
              className="absolute flex w-px flex-col"
              style={{ marginRight: 6 * i + "px" }}
            >
              <div className="h-2 bg-slate-400"></div>
              <p className="mt-px ml-[-10px]">
                {display}
              </p>
              {month === 'Dec' && 
                <p className="mt-px ml-[-15px]">
                  {c.date.getFullYear()+1}
                </p>
              }
            </div>
          );
        }
      })}
    </div>
  );
};

export default ChartXbar;
