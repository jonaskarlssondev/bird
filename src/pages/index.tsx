import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { Profile } from "./components/profile";

const Home: NextPage = () => {
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

      <main className="flex min-h-screen bg-dark-primary p-2 text-dark-contrast">
        <Content />
      </main>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  const { data: sessionData, status } = useSession();

  if (status !== "loading") {
    if (sessionData) {
      return (
        <section className="flex h-fit w-full justify-between">
          <p className="font-extrabold leading-tight tracking-tight text-dark-accent/80 sm:text-[2rem]">
            BIRD
          </p>
          <Profile />
        </section>
      );
    }

    return <SignIn />;
  }

  return <div></div>;
};

const SignIn: React.FC = () => {
  return (
    <section className="flex w-full flex-col items-center justify-center">
      <h1 className="font-extrabold tracking-tight text-dark-accent/80 sm:text-[7rem]">
        BIRD
      </h1>
      <button
        className="rounded-full border border-solid border-dark-secondary px-7 py-3 font-semibold no-underline transition hover:bg-dark-secondary"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </section>
  );
};
