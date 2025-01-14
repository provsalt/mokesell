"use client";

import {createContext, ReactNode} from "react";

interface User {
  username: string,
  name: string
  email: string
  description: string
  token: string
}

export const UserContext = createContext<User | null>(null);

export const UserProvider = (props: {children: ReactNode}) => {
  if (typeof localStorage === "undefined") return;
  const userData = localStorage.getItem("user")
  let user: User | null;
  if (!userData) {
    user = null;
  } else {
    user = JSON.parse(userData)
  }
  return (
    <UserContext value={user}>
      {props.children}
    </UserContext>
  )
}