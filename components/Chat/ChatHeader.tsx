"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  listingTitle: string;
  listingImage?: string | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  listingTitle,
  listingImage,
}) => {
  const [width, setWidth] = useState<number>(
    typeof window === "undefined" ? 0 : window.innerWidth,
  );
  const { push } = useRouter();

  const handleWindowSizeChange = () => {
    if (typeof window === "undefined") return;
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, []);

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {width <= 768 && (
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => push("/chats")}
          ></ArrowLeft>
        )}
        {listingImage ? (
          <Image
            width={64}
            height={64}
            src={listingImage}
            alt="Listing"
            className="w-10 h-10 rounded-sm object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        )}
        <div className="font-medium truncate">{listingTitle}</div>
      </div>
    </div>
  );
};
