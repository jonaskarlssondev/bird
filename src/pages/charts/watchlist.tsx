import { Watchlist, type WatchlistTicker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const WatchListSelector: React.FC<{
  onSelectTicker: (ticker: string) => void;
}> = (props) => {
  const { data: sessionData } = useSession();

  if (!sessionData || !sessionData.user) {
    return <></>;
  }

  const { data, refetch, status } = trpc.watchlist.getWatchlist.useQuery({
    userId: sessionData.user.id,
  });

  if (status === "loading") {
    return <></>;
  }

  if (data) {
    return (
      <div className="flex h-fit w-fit flex-col divide-y divide-dark-secondary rounded border border-solid border-dark-secondary">
        <Watchlist
          list={data}
          onSelectTicker={(ticker) => props.onSelectTicker(ticker)}
          onAddTickerSuccess={() => refetch()}
          onRemoveTickerSuccess={() => refetch()}
          onRemoveWatchlistSuccess={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex h-fit w-fit flex-col divide-y divide-dark-secondary rounded border border-solid border-dark-secondary">
      <span className="p-2 text-sm">You do not have a watchlist</span>
      <CreateWatchlist onSuccess={() => refetch()} />
    </div>
  );
};

export default WatchListSelector;

const Watchlist: React.FC<{
  list: Watchlist & { tickers: WatchlistTicker[] };
  onSelectTicker: (ticker: string) => void;
  onAddTickerSuccess: () => void;
  onRemoveTickerSuccess: () => void;
  onRemoveWatchlistSuccess: () => void;
}> = (props) => {
  const removeTickerMutation = trpc.watchlist.deleteTicker.useMutation({
    onSuccess: () => {
      props.onRemoveTickerSuccess();
    },
  });

  const removeTicker = (id: string) => {
    removeTickerMutation.mutate({ tickerId: id, watchlistId: props.list.id });
  };

  const [ticker, setTicker] = useState(props.list.tickers[0]?.ticker);
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
      watchlistId: props.list.id,
    });
  };

  return (
    <>
      <span className="flex flex-row items-center justify-between p-1">
        <h1 className="text-sm">{props.list.name}</h1>
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
      <ul className="p-1 text-xs">
        {props.list.tickers.map((x) => (
          <li key={x.id} className="flex items-center py-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-3 w-3 hover:cursor-pointer"
              onClick={() => {
                removeTicker(x.id);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span
              className="ml-1 w-fit rounded border border-solid border-dark-secondary px-1 hover:cursor-pointer hover:bg-dark-secondary"
              onClick={() => selectTicker(x.ticker)}
            >
              {x.ticker}
            </span>
          </li>
        ))}
        <li className="pt-0.5">
          <AddTicker
            watchlist={props.list}
            onSuccess={props.onAddTickerSuccess}
          />
        </li>
      </ul>
    </>
  );
};

const AddTicker: React.FC<{
  watchlist: Watchlist;
  onSuccess: () => void;
}> = (props) => {
  const [ticker, setTicker] = useState("");
  const [input, toggleInput] = useState(false);

  const addTicker = trpc.watchlist.addTicker.useMutation({
    onSuccess: () => {
      props.onSuccess();
      setTicker("");
      toggleInput((e) => !e);
    },
  });

  const add = () => {
    addTicker.mutate({ ticker: ticker, watchlistId: props.watchlist.id });
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
                "w-24 rounded bg-dark-secondary p-0.5 text-xs focus:outline-dark-accent"
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

const CreateWatchlist: React.FC<{ onSuccess: () => void }> = (props) => {
  const [name, setName] = useState("New watchlist");
  const [createWatchlist, setCreateWatchlist] = useState(false);

  const mutation = trpc.watchlist.createWatchlist.useMutation({
    onSuccess: () => {
      props.onSuccess();
    },
  });

  const submit = () => {
    mutation.mutate({ name: name });
  };

  return (
    <>
      {!createWatchlist && (
        <div className="px-2 py-1">
          <button
            onClick={() => setCreateWatchlist((e) => !e)}
            className="w-fit rounded-full border border-solid border-dark-secondary px-3 py-0.5 text-xs font-semibold no-underline transition hover:cursor-pointer hover:bg-dark-secondary"
          >
            Create watchlist
          </button>
        </div>
      )}

      {createWatchlist && (
        <form
          className="flex flex-col gap-2 p-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            autoFocus
            className="rounded bg-dark-secondary p-1 text-xs"
            placeholder="Name"
            type="text"
            value={name}
            onChange={(c) => setName(c.target.value)}
          />
          <div>
            <button
              type="submit"
              className="w-fit rounded-full border border-solid border-dark-secondary px-3 py-0.5 text-xs font-semibold no-underline transition hover:cursor-pointer hover:bg-dark-secondary"
            >
              Create
            </button>
            <button
              onClick={() => setCreateWatchlist((e) => !e)}
              className="ml-2 w-fit text-xs no-underline transition hover:cursor-pointer hover:text-dark-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};
