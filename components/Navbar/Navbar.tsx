"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {MessageCircle, User} from "lucide-react";
import {useContext} from "react";
import {UserContext} from "@/providers/UserProvider";

export const Navbar = () => {
  const [user, ] = useContext(UserContext)
  if (user) {
    return (
      <nav className="flex p-4 justify-between text-lg">
      <p className="font-bold text-lg"><Link href="/">Mokesell</Link></p>
      <div className="flex gap-4">
        <Link href="/">
          <Button className="bg-transparent">Sell</Button>
        </Link>
        <Link href="/user">
          <Button className="bg-blue-transparent">
            <User/>
            <p className="sr-only">User</p>
          </Button>
        </Link>
        <Link href="/chats">
          <Button className="bg-blue-transparent">
            <MessageCircle/>
            <p className="sr-only">Chat</p>
          </Button>
        </Link>
      </div>
    </nav>
    )
  }
  return (
    <nav className="flex p-4 justify-between text-lg">
      <p className="font-bold"><Link href="/">Mokesell</Link></p>
      <div className="flex gap-4">
        <Link href="/signup">
          <Button className="bg-transparent">Sign up</Button>
        </Link>
        <Link href="/login">
          <Button className="bg-blue-500">Login</Button>
        </Link>

      </div>
    </nav>
  )
}