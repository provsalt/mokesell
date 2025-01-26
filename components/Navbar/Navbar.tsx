"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle, Search, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");

  const logout = () => {
    if (setUser) {
      setUser(undefined);
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem("user");
    }
  };
  const [width, setWidth] = useState<number>(
    typeof window === "undefined" ? 0 : window.innerWidth,
  );

  const handleWindowSizeChange = () => {
    if (typeof window === "undefined") return;
    setWidth(window.innerWidth);
  };

  const { push } = useRouter();

  const search = () => {
    push("/search?" + new URLSearchParams({ query: searchQuery }).toString());
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  if (user) {
    return (
      <nav className="flex flex-col p-4">
        <div className="flex py-4 md:py-2 items-center justify-between text-lg">
          <p className="font-bold text-lg">
            <Link href="/">Mokesell</Link>
          </p>
          {width >= 768 && (
            <div className="flex">
              <Input
                className="min-w-[25vw]"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  setSearchQuery(target.value);
                }}
                value={searchQuery}
                placeholder="Search"
              />
              <Button onClick={search}>
                <Search />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Link href="/">
              <Button className="dark:bg-transparent">Sell</Button>
            </Link>
            <Link href="/user">
              <Button className="dark:bg-transparent">
                <User />
              </Button>
            </Link>
            <Link href="/chats">
              <Button className="dark:bg-transparent">
                <MessageCircle />
                <p className="sr-only">Chat</p>
              </Button>
            </Link>
            <Button onClick={logout} className="dark:bg-transparent">
              <LogOut />
              <p className="sr-only">Logout</p>
            </Button>
          </div>
        </div>
        {width <= 768 && (
          <div className="flex">
            <Input
              className="min-w-[25vw]"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                setSearchQuery(target.value);
              }}
              value={searchQuery}
              placeholder="Search"
            />
            <Button onClick={search}>
              <Search />
            </Button>
          </div>
        )}
      </nav>
    );
  }
  return (
    <nav className="flex p-4 flex-col">
      <div className="flex py-4 md:py-2 items-center justify-between text-lg">
        <p className="font-bold">
          <Link href="/">Mokesell</Link>
        </p>
        {width >= 768 && (
          <div className="flex">
            <Input
              className="min-w-[25vw]"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                setSearchQuery(target.value);
              }}
              value={searchQuery}
              placeholder="Search"
            />
            <Button onClick={search}>
              <Search />
            </Button>
          </div>
        )}
        <div className="flex gap-4">
          <Link href="/signup">
            <Button className="dark:bg-transparent text-gray-50 dark:text-gray-50">
              Sign up
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-blue-500">Login</Button>
          </Link>
        </div>
      </div>
      {width <= 768 && (
        <div className="flex">
          <Input
            className="min-w-[25vw]"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setSearchQuery(target.value);
            }}
            value={searchQuery}
            placeholder="Search"
          />
          <Button onClick={search}>
            <Search />
          </Button>
        </div>
      )}
    </nav>
  );
};
