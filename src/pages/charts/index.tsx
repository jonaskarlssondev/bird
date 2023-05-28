import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import CreateWatchList from "./createWatchList";
import WatchList from "./watchlist";

const Charts: NextPage = () => {
    const { data: sessionData } = useSession();
    const router = useRouter();

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
        return <CreateWatchList onSuccess={refetch}/>
    }

    return (
        <div className="w-full flex flex-row justify-center pt-16">
            <WatchList onSelect={(ticker) => { console.log(ticker); router.push(router.asPath + '/' + ticker)}} />
        </div>
    );
};

export default Charts;
