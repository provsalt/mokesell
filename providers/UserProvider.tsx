"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface User {
  username: string;
  name: string;
  email: string;
  description: string; // bio in profile
}

export const UserContext = createContext<
  [User | undefined, Dispatch<SetStateAction<User | undefined>> | undefined]
>([undefined, undefined]);

export const UserProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(undefined);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};
