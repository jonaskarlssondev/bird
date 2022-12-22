import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Login from "./login";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  if (status == "loading") {
    return <></>;
  }

  if (!sessionData) {
    return <Login />;
  }

  return <></>;
};

export default Home;
