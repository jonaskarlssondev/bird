import { type NextPage } from "next";
import Head from "next/head";

import { Profile } from "./components/profile";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "./login";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return <Login />;
  }

  return (
    <>
      <Head>
        <title>Bird</title>
        <meta
          name="description"
          content="Financial analysis tool for overview and flags"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen bg-dark-primary p-2 text-dark-contrast">
        <Content />
      </div>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  return (
    <main className="flex w-full flex-col">
      <section className="flex h-fit w-full justify-between">
        <span className="mt-[-0.5rem] font-extrabold leading-tight tracking-tight text-dark-accent/80 sm:text-[2rem]">
          <Link href="/">BIRD</Link>
        </span>
        <Navbar />
        <Profile expandable={true} />
      </section>
    </main>
  );
};

const Navbar: React.FC = () => {
  return (
    <section className="flex flex-row gap-2 text-dark-accent">
      <Link href="/" className="hover:cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
          />
        </svg>
      </Link>
      <Link href="/" className="hover:cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </Link>
    </section>
  );
};
