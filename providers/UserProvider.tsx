"use client";

import {createContext, ReactNode} from "react";

interface User {
  username: string,
  name: string
  email: string
  description: string
}

export const UserContext = createContext<User | null>(null);

export const UserProvider = (props: {children: ReactNode}) => {
  return (
    <UserContext value={null}>
      {props.children}
    </UserContext>
  )
}