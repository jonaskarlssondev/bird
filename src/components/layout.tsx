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
            <div className="flex min-h-screen w-screen flex-col bg-dark-primary pt-2 pr-2 pl-2 text-slate-300">
                <section className="flex h-10 w-full  items-center justify-between pb-2">
                    <span className="h-full w-16 text-2xl font-extrabold tracking-tight text-dark-accent/80">
                        <Link href="/">BIRD</Link>
                    </span>
                    <Navbar />
                    <span className="flex h-full w-16 justify-end">
                        <Profile expandable={true} />
                    </span>
                </section>
                <main>{children}</main>
            </div>
        </>
    );
}
