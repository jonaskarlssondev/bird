import { ReactNode } from "react";

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

export default ChartYbar;
