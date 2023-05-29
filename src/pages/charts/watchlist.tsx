import { type Watchlist, type WatchlistTicker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const WatchList: React.FC<{
    onSelect: (ticker: string) => void;
}> = (props) => {
    const { data: sessionData } = useSession();

    if (!sessionData || !sessionData.user) {
        return <></>;
    }

    const { data, refetch, status } = trpc.watchlist.getWatchlist.useQuery({
        userId: sessionData.user.id,
    });

    if (status === "loading" || !data) {
        return <></>;
    }

    return (
        <div className="flex w-72 flex-col divide-y divide-dark-secondary rounded border border-solid border-dark-secondary bg-dark-primary">
            <WatchlistSelector
                list={data}
                onSelectTicker={(ticker) => props.onSelect(ticker)}
                onTickerEvent={(_) => refetch()}
                onRemoveWatchlistSuccess={() => refetch()}
            />
        </div>
    );
};

export default WatchList;

const WatchlistSelector: React.FC<{
    list: Watchlist & { tickers: WatchlistTicker[] };
    onSelectTicker: (ticker: string) => void;
    onTickerEvent: (id: string, type: "add" | "remove") => void;
    onRemoveWatchlistSuccess: () => void;
}> = (props) => {
    const addTickerMutation = trpc.watchlist.addTicker.useMutation({
        onSuccess: (data) => props.onTickerEvent(data.id, "add"),
    });

    const addTicker = (ticker: string) => {
        addTickerMutation.mutate({
            ticker: ticker,
            watchlistId: props.list.id,
        });
    };

    const removeTickerMutation = trpc.watchlist.deleteTicker.useMutation({
        onSuccess: (_, variables) =>
            props.onTickerEvent(variables.tickerId, "remove"),
    });

    const removeTicker = (id: string) => {
        removeTickerMutation.mutate({
            tickerId: id,
            watchlistId: props.list.id,
        });
    };

    const [ticker, setTicker] = useState("");
    const selectTicker = (tckr: string) => {
        if (ticker !== tckr) {
            setTicker(tckr);
            props.onSelectTicker(tckr);
        }
    };

    const removeWatchlistMutation = trpc.watchlist.deleteWatchlist.useMutation({
        onSuccess: () => props.onRemoveWatchlistSuccess(),
    });

    const removeWatchlist = (id: string) => {
        removeWatchlistMutation.mutate({
            watchlistId: id,
        });
    };

    return (
        <>
            <span className="flex flex-row items-center justify-between p-2">
                <h1 className="text-m">{props.list.name}</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4 hover:cursor-pointer"
                    onClick={() => {
                        removeWatchlist(props.list.id);
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </span>
            <ul className="divide-y divide-dark-secondary/80 text-sm">
                <li className="flex w-full items.center p-2 hover:cursor-pointer hover:bg-dark-secondary">
                    <span onClick={() => selectTicker('all')}>SHOW ALL</span>
                </li>
                {props.list.tickers.map((x) => (
                    <WatchListItem
                        key={x.id}
                        ticker={x}
                        onSelect={(ticker) => selectTicker(ticker)}
                        onRemove={(id) => removeTicker(id)}
                    />
                ))}
                <li className="p-2">
                    <AddTicker onAdd={(ticker) => addTicker(ticker)} />
                </li>
            </ul>
        </>
    );
};

const WatchListItem: React.FC<{
    ticker: WatchlistTicker;
    onSelect: (ticker: string) => void;
    onRemove: (id: string) => void;
}> = (props) => {
    return (
        <li className="flex w-full items-center p-2 hover:cursor-pointer hover:bg-dark-secondary">
            <div
                className="h-full w-content cursor-pointer"
                onClick={() => props.onRemove(props.ticker.id)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-3 w-3"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
            <div className="flex-1" onClick={() => props.onSelect(props.ticker.ticker)}>
                <span className="ml-1 px-1">{props.ticker.ticker}</span>
            </div>
        </li>
    );
};

const AddTicker: React.FC<{
    onAdd: (ticker: string) => void;
}> = (props) => {
    const [ticker, setTicker] = useState("");
    const [input, toggleInput] = useState(false);

    const add = () => {
        props.onAdd(ticker);
        setTicker("");
        toggleInput((e) => !e);
    };

    return (
        <>
            {!input && (
                <div
                    className="ml-[-0.06rem] flex flex-row items-center hover:cursor-pointer"
                    onClick={() => toggleInput((e) => !e)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-3.5 w-3.5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m6-6H6"
                        />
                    </svg>{" "}
                    <span className="px-1 text-xs">Add ticker</span>{" "}
                </div>
            )}
            {input && (
                <div className="flex flex-row items-center gap-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-3 w-3 hover:cursor-pointer"
                        onClick={() => toggleInput((e) => !e)}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            add();
                        }}
                    >
                        <input
                            autoFocus
                            className={
                                "w-36 rounded bg-dark-secondary p-1 text-xs focus:outline-dark-accent"
                            }
                            placeholder="Ticker"
                            type="text"
                            value={ticker}
                            onChange={(c) => setTicker(c.target.value)}
                        />
                        <button
                            type="submit"
                            className="ml-1 w-fit rounded-full border border-solid border-dark-secondary px-3 py-0.5 text-xs font-semibold no-underline outline-dark-accent transition hover:cursor-pointer hover:bg-dark-secondary"
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};
