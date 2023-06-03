import type { candles } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { useWindowDimensions } from "../../../utils/hooks";
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
            <div className="min-h-12 w-full rounded border border-dark-secondary bg-dark-primary p-1">
                <div className="flex h-64 items-center justify-center">
                    No data available
                </div>
            </div>
        );
    }

    const height = () => {
        const init = size.width * 0.5;
        return Math.max(250, Math.min(init, size.height * 0.6));
    };

    const maxHeight = height() - 24 - 48;

    const maxY = Math.max(...data.map((x) => x.high));
    const minY = Math.max(0, Math.min(...data.map((x) => x.low)));

    // Pixels Per Currency - Computes the number of pixels per currency unit.
    // If a security has moved 500 e.g. dollars in the timespan - then each dollar would be represented by 1 pixel.
    const ppc = maxHeight / (maxY - minY);

    return (
        <div className="min-h-12 w-full rounded border border-dark-secondary bg-dark-primary p-1">
            <div className="grid grid-cols-[auto_60px] grid-rows-[auto_50px]">
                <section className="h-[50vw] max-h-[60vh] min-h-[250px] overflow-hidden pr-[6px]">
                    <div className="flex flex-row-reverse pt-4 pb-2">
                        {data.map((c) => (
                            <Candle
                                key={c.id}
                                candle={c}
                                factor={ppc}
                                max={maxY}
                            />
                        ))}
                        <div className="absolute text-4xl text-slate-200/20 font-extrabold tracking-tight flex h-[calc(50vw-72px)] max-h-[calc(60vh-72px)] min-h-[calc(250px-72px)] w-[calc(100%-92px)] items-center justify-center">
                            {props.ticker}
                        </div>
                    </div>
                    <Volume data={data.map((x) => Number(x.volume))} />
                </section>
                <section className="border-l border-dark-secondary pt-4 pb-2">
                    <ChartYbar
                        renderHeight={height() - 24}
                        padding={8}
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
                <section className="border-t border-dark-secondary pr-[6px]">
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
    const thinHeightCalc =
        (props.candle.high - props.candle.low) * props.factor;
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
        <div className="z-20">
            <div
                style={thinStyle}
                onMouseOver={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
            >
                <div className={bg + " ml-[3px] h-full w-[1px]"}></div>
                <div
                    style={thickStyle}
                    className={bg + " ml-[1px] w-[5px]"}
                ></div>
            </div>

            {showDetails && <CandleDetails candle={props.candle} />}
        </div>
    );
};

const CandleDetails: React.FC<{ candle: candles }> = (props) => {
    return (
        <div className="absolute z-10 mt-1 rounded bg-gray-600 p-1 text-xs text-slate-400">
            <p>Date: {props.candle.date.toLocaleDateString("sv-SE")}</p>
            <p>
                Open:{" "}
                {Math.round((props.candle.open + Number.EPSILON) * 100) / 100}
            </p>
            <p>
                High:{" "}
                {Math.round((props.candle.high + Number.EPSILON) * 100) / 100}
            </p>
            <p>
                Low:{" "}
                {Math.round((props.candle.low + Number.EPSILON) * 100) / 100}
            </p>
            <p>
                Close:{" "}
                {Math.round((props.candle.close + Number.EPSILON) * 100) / 100}
            </p>
            <p>Volume: {Number(props.candle.volume)}</p>
        </div>
    );
};
