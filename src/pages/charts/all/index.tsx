import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import Chart from "../chart/chart";
import CreateWatchList from "../createWatchList";

const All: NextPage = () => {
    const { data: sessionData } = useSession();

    if (!sessionData || !sessionData.user) {
        return <></>;
    }

    const { data, refetch, status } = trpc.watchlist.getWatchlist.useQuery({
        userId: sessionData.user.id,
    });

    if (status === "loading") {
        return <p>Loading..</p>;
    }

    if (!data) {
        return <CreateWatchList onSuccess={refetch} />;
    }

    return (
        <div className="flex flex-col">
            {data.tickers.map((x) => (
                <div key={x.id} className="mb-2">
                    <Chart ticker={x.ticker}/>
                </div>
            ))}
        </div>
    );
};

export default All;
