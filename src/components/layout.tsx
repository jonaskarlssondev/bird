import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Login from "../pages/login";
import Navbar from "./navbar";
import Profile from "./profile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: sessionData, status } = useSession();

  if (status == "loading") {
    return <></>;
  }

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
      <div className="flex min-h-screen w-full flex-col bg-dark-primary p-2 text-slate-300">
        <section className="mb-2 flex h-fit w-full justify-between">
          <span className="mt-[-0.5rem] font-extrabold leading-tight tracking-tight text-dark-accent/80 sm:text-[2rem]">
            <Link href="/">BIRD</Link>
          </span>
          <Navbar />
          <Profile expandable={true} />
        </section>
        <main>{children}</main>
      </div>
    </>
  );
}
