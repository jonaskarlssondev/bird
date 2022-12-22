import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Profile from "./components/profile";

const Login: NextPage = () => {
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
        <SignIn />
      </div>
    </>
  );
};

export default Login;

const SignIn: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <section className="flex w-full flex-col items-center justify-center">
      <h1 className="font-extrabold tracking-tight text-dark-accent/80 hover:cursor-pointer sm:text-[7rem]">
        <Link href="/">BIRD</Link>
      </h1>
      {sessionData ? (
        <Profile />
      ) : (
        <button
          className="rounded-full border border-solid border-dark-secondary px-7 py-3 font-semibold no-underline transition hover:bg-dark-secondary"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      )}
    </section>
  );
};
