import { useState } from "react";
import { trpc } from "../../utils/trpc";

const CreateWatchlist: React.FC<{ onSuccess: () => void }> = (props) => {
    const [name, setName] = useState("New watchlist");

    const mutation = trpc.watchlist.createWatchlist.useMutation({
    onSuccess: () => {
      props.onSuccess();
    },
  });

  const submit = () => {
    mutation.mutate({ name: name });
  };

  return (
    <section className="w-full flex flex-col items-center">
        <span className="w-3/4 pt-48 pb-12 text-xl text-dark-accent-secondary-alt text-center">You do not have a watchlist, go ahead and create one!</span>
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            autoFocus
            className="w-64 h-8 rounded bg-dark-secondary p-2 text-xs"
            type="text"
            value={name}
            onFocus={(e) => e.target.select()}
            onChange={(c) => setName(c.target.value)}
          />
          <div>
            <button
              type="submit"
              className="w-fit rounded-full border border-solid border-dark-secondary px-6 py-2 text-xs font-semibold no-underline transition hover:cursor-pointer hover:bg-dark-secondary"
            >
              Create
            </button>
          </div>
        </form>
    </section>
  );
};

export default CreateWatchlist;
