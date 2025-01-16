"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LogOut, MessageCircle, User} from "lucide-react";
import {useContext} from "react";
import {UserContext} from "@/providers/UserProvider";

export const Navbar = () => {
  const [user, setUser ] = useContext(UserContext)

  const logout = () => {
    if (setUser) {
      setUser(undefined)
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem("user")
    }
  }

  if (user) {
    return (
      <nav className="flex p-4 justify-between text-lg">
      <p className="font-bold text-lg"><Link href="/">Mokesell</Link></p>
      <div className="flex gap-2">
        <Link href="/">
          <Button className="dark:bg-transparent">Sell</Button>
        </Link>
        <Link href="/user">
          <Button className="dark:bg-transparent">
            <User/>
            <p>Hi {user.name}</p>
          </Button>
        </Link>
        <Link href="/chats">
          <Button className="dark:bg-transparent">
            <MessageCircle/>
            <p className="sr-only">Chat</p>
          </Button>
        </Link>
        <Button onClick={logout} className="dark:bg-transparent">
          <LogOut/>
          <p className="sr-only">Logout</p>
        </Button>
      </div>
    </nav>
    )
  }
  return (
    <nav className="flex p-4 justify-between text-lg">
      <p className="font-bold"><Link href="/">Mokesell</Link></p>
      <div className="flex gap-4">
        <Link href="/signup">
          <Button className="dark:bg-transparent text-gray-50 dark:text-gray-50">Sign up</Button>
        </Link>
        <Link href="/login">
          <Button className="bg-blue-500">Login</Button>
        </Link>

      </div>
    </nav>
  )
}