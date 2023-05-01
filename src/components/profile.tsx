import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export const Profile: React.FC<{ expandable?: boolean }> = ({
  expandable = false,
}) => {
  const { data: sessionData } = useSession();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex h-8 w-8 flex-col items-end gap-1">
      <div
        className={expandable ? "hover:cursor-pointer" : ""}
        onClick={() => {
          if (expandable) {
            setExpanded((e) => !e);
          }
        }}
      >
        {sessionData && sessionData.user?.image && (
          <Image
            className="rounded-full"
            width={40}
            height={40}
            src={sessionData.user?.image}
            alt="User profile image"
          />
        )}
      </div>

      {expanded && <ExpandedProfile />}
    </div>
  );
};

const ExpandedProfile: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="z-[999] flex h-fit w-fit flex-col divide-y divide-dark-secondary rounded border border-solid border-dark-secondary bg-dark-primary">
      <div className="flex items-center justify-center gap-2 whitespace-nowrap p-2">
        <div className="h-10 w-10">
          {sessionData && sessionData.user?.image && (
            <Image
              className="rounded-full"
              width={48}
              height={48}
              src={sessionData.user?.image}
              alt="User profile image"
            />
          )}
        </div>
        {sessionData && (
          <span className="text-sm">{sessionData.user?.name}</span>
        )}
      </div>

      <div className="flex justify-end p-2">
        <ul className="text-xs">
          <li>
            <button className="hover:cursor-pointer" onClick={() => signOut()}>
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
