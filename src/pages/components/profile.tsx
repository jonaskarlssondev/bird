import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export const Profile: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="h-10 w-10 hover:cursor-pointer" onClick={() => signOut()}>
      {sessionData && sessionData.user?.image && (
        <img className="rounded-full" src={sessionData.user?.image} />
      )}
    </div>
  );
};

export default Profile;
