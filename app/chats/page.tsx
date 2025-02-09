"use client";

import { ChatWelcome } from "@/components/Chat/ChatWelcome";
import { useEffect, useState } from "react";

const Page = () => {
  const [width, setWidth] = useState<number>(
    typeof window === "undefined" ? 0 : window.innerWidth,
  );

  const handleWindowSizeChange = () => {
    if (typeof window === "undefined") return;
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, []);

  if (width <= 768) return;

  return <ChatWelcome />;
};

export default Page;
