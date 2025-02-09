"use client";

import { useState, useContext, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import ChatList from "@/components/Chat/ChatList";
import { UserContext } from "@/providers/UserProvider";
import { useParams, useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { Input } from "@/components/ui/input";

interface Conversation {
  id: number;
  listingId: number;
  buyerUsername: string;
  sellerUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ChatSidebar = ({
  conversations,
}: { conversations: Conversation[] }) => {
  const [user] = useContext(UserContext);
  const { push } = useRouter();

  const [width, setWidth] = useState<number>(
    typeof window === "undefined" ? 0 : window.innerWidth,
  );
  const [search, setSearch] = useState("");

  const filteredChats = useMemo(
    () => [
      ...new Set(
        conversations.filter((chat) => {
          const username =
            user?.username === chat.buyerUsername
              ? chat.sellerUsername
              : chat.buyerUsername;
          if (search === "") return true;
          return username.includes(search);
        }),
      ),
    ],
    [conversations, search, user?.username],
  );

  const handleWindowSizeChange = () => {
    if (typeof window === "undefined") return;
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => window.removeEventListener("resize", handleWindowSizeChange);
  }, []);

  const params = useParams<{ id: string | undefined }>();
  if (!user) {
    return <div>Error</div>;
  }

  if (width <= 768 && params.id) {
    return;
  }

  return (
    <>
      <div
        className={`inset-y-0 left-0 w-full sm:w-80 lg:w-96 
                transform lg:transform-none transition-transform duration-300 ease-in-out
                bg-gray-50 border-r z-10 flex flex-col`}
      >
        <div className="p-4 bg-gray-50 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(i) => setSearch(i.target.value)}
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border"
            />
          </div>
        </div>

        {/* ChatList Component */}
        <ChatList
          conversations={filteredChats.map((chat) => ({
            id: chat.id,
            username:
              user.username === chat.buyerUsername
                ? chat.sellerUsername
                : chat.buyerUsername,
            lastMessage:
              formatDistance(Date.now(), chat.updatedAt) + " ago" ||
              "No messages yet",
          }))}
          selectedChatId={Number(params.id)}
          onSelectChat={(chatId) => {
            push(`/chats/${chatId}`);
          }}
        />
      </div>
    </>
  );
};
