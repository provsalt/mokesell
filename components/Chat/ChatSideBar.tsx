"use client";

import { MessageCircle } from "lucide-react";
import { useState, useContext } from "react";
import { Search } from "lucide-react";
import ChatList from "@/components/Chat/ChatList";
import { UserContext } from "@/providers/UserProvider";
import { useParams, useRouter } from "next/navigation";
import { formatDistance } from "date-fns";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user] = useContext(UserContext);
  const { push } = useRouter();
  const params = useParams<{ id: string }>();
  console.log(params);
  if (!user) {
    return <div>Error</div>;
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-20 left-4 z-50 bg-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <div
        className={`fixed lg:static inset-y-0 left-0 w-full sm:w-80 lg:w-96 
                transform lg:transform-none transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                bg-gray-50 border-r z-40 flex flex-col`}
      >
        <div className="p-4 bg-gray-50 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border"
            />
          </div>
        </div>

        {/* ChatList Component */}
        <ChatList
          conversations={conversations.map((chat) => ({
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
