import { Watchlist, WatchlistTicker } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const Charts: NextPage = () => {
  return (
    <>
      <WatchListSelector />
    </>
  );
};

export default Charts;

const WatchListSelector: React.FC = () => {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) {
    return <></>;
  }

  const { data } = trpc.user.getWatchLists.useQuery({
    userId: sessionData.user.id,
  });

  if (data?.length && data?.length > 0 && data[0]) {
    return (
      <div className="flex h-fit w-fit flex-col divide-y divide-dark-secondary rounded border border-solid border-dark-secondary">
        <Watchlist list={data[0]} />
        <span className="p-2 text-sm hover:cursor-pointer">Create new</span>
      </div>
    );
  }

  return (
    <div className="flex h-fit w-fit flex-col divide-y divide-dark-secondary rounded border border-solid border-dark-secondary">
      <span className="p-2">You have no watchlists</span>
      <span className="p-2 text-sm hover:cursor-pointer">Create new</span>
    </div>
  );
};

const Watchlist: React.FC<{
  list: Watchlist & { tickers: WatchlistTicker[] };
}> = (props) => {
  return (
    <>
      <h1 className="p-2 text-xl">{props.list.name}</h1>
      <ul className="p-2 text-sm">
        {props.list.tickers.map((x) => (
          <li className="hover:cursor-pointer">{x.ticker}</li>
        ))}
      </ul>
    </>
  );
};
