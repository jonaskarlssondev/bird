import { type NextPage } from "next";
import { useState } from "react";
import Chart from "./chart/chart";
import WatchListSelector from "./watchlist";

const Charts: NextPage = () => {
  const [activeTicker, setActiveTicker] = useState("AAPL");

  return (
    <>
      <div className="max-w-screen flex-between flex overflow-x-hidden">
        <span className="w-48">
          <WatchListSelector
            onSelectTicker={(ticker) => setActiveTicker(ticker)}
          />
        </span>

        <span className="flex max-w-[calc(100vw-24rem)] flex-1 justify-center">
          <span className="flex max-w-[1750px]">
            <Chart ticker={activeTicker} />
          </span>
        </span>

        <span className="w-48"></span>
      </div>
    </>
  );
};

export default Charts;
