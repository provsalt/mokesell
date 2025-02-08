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
  exp: number
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
        const parsed = JSON.parse(userData);
        if (!parsed.exp || Date.now() > parsed.exp) {
          setUser(undefined)
          return
        }
        setUser(parsed);
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
