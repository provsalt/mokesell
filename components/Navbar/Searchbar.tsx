"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { push } = useRouter();

  const search = (e: FormEvent) => {
    e.preventDefault();
    // if (!searchQuery) return;
    push("/listings?" + new URLSearchParams({ query: searchQuery }).toString());
  };

  return (
    <form onSubmit={search} className="flex">
      <Input
        className="min-w-[25vw]"
        onChange={(e) => setSearchQuery(e.target.value)}
        autoComplete="off"
        value={searchQuery}
        placeholder="Search"
      />
      <Button type="submit">
        <Search />
      </Button>
    </form>
  );
};

export default SearchBar;
