"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, MessageCircle, Search, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/mokesell.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [user, setUser] = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");

  const logout = () => {
    if (setUser) {
      setUser(undefined);
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem("user");
      fetch("/api/logout").then();
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
    if (!searchQuery) return;
    push("/listings?" + new URLSearchParams({ query: searchQuery }).toString());
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
          <Link href="/" className="inline-flex items-center">
            <Image src={Logo} alt="Mokesell logo" width={64} height={64} />
            <span className="font-bold text-lg">Mokesell</span>
          </Link>
          {width >= 768 && (
            <>
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
              <div className="flex gap-2">
                <Button asChild className="bg-blue-500 hover:bg-blue-600">
                  <Link href="/sell">Sell</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-gray-950 rounded-md text-gray-50 inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium ">
                    Games
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <Link href="/games/coinflip">
                      <DropdownMenuItem>Mokeflip</DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button asChild className="dark:bg-transparent">
                  <Link href="/profile">
                    <User />
                  </Link>
                </Button>
                <Button asChild className="dark:bg-transparent">
                  <Link href="/chats">
                    <MessageCircle />
                    <p className="sr-only">Chat</p>
                  </Link>
                </Button>
                <Button onClick={logout} className="dark:bg-transparent">
                  <LogOut />
                  <p className="sr-only">Logout</p>
                </Button>
              </div>
            </>
          )}
          {width <= 768 && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href="/chats">
                  <DropdownMenuItem>Chat</DropdownMenuItem>
                </Link>
                <Link href="/sell">
                  <DropdownMenuItem>Sell</DropdownMenuItem>
                </Link>
                <DropdownMenuLabel>Games</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/games/coinflip">
                  <DropdownMenuItem>Mokeflip</DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  onClick={logout}
                  className="dark:bg-transparent"
                >
                  <LogOut />
                  <p>Logout</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
        <Link href="/" className="inline-flex items-center">
          <Image src={Logo} alt="Mokesell logo" width={64} height={64} />
          <span className="font-bold text-lg">Mokesell</span>
        </Link>

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
