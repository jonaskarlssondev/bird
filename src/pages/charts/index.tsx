import { type NextPage } from "next";
import { useState } from "react";
import Chart from "./chart/chart";
import WatchListSelector from "./watchlist";

const Charts: NextPage = () => {
  const [activeTicker, setActiveTicker] = useState("AAPL");

  return (
    <>
      <div className="max-w-screen flex-between flex overflow-x-hidden">
        <span className="w-64">
          <WatchListSelector
            onSelectTicker={(ticker) => setActiveTicker(ticker)}
          />
        </span>

        <span className="ml-2 max-w-[calc(100vw-32rem)] flex-1">
          <Chart ticker={activeTicker} />
        </span>

        <span className="w-64"></span>
      </div>
    </>
  );
};

export default Charts;
