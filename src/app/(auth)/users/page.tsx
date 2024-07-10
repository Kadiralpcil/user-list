"use client";
//React
import { useState } from "react";

//Components
import UserCard from "./user-card";
import UserTable from "./users/user-table";

//Types
import { User } from "@/lib/types";

const Users = () => {
  //States
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  return (
    <div className="flex flex-col gap-2">
      <div className="shadow-md rounded-md p-2">
        <UserTable onCurrentUserChange={(user: User) => setCurrentUser(user)} />
      </div>
      <div className="shadow-md rounded-md p-2">
        <UserCard userId={currentUser?.id} />
      </div>
    </div>
  );
};

export default Users;
