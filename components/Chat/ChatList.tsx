import React, { memo } from "react";
import { Avatar } from "@/components/Avatar/Avatar";

interface Conversation {
  id: number;
  username: string;
  lastMessage: string;
}

interface ChatListProps {
  conversations: Conversation[];
  selectedChatId: number | undefined;
  onSelectChat: (id: number) => void;
}

const ChatList: React.FC<ChatListProps> = memo(
  ({ conversations, selectedChatId, onSelectChat }) => {
    return (
      <div className="w-full max-w-sm bg-gray-50 border-r p-4 space-y-2">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-3 p-4 cursor-pointer rounded-lg transition-colors ${
              selectedChatId === chat.id ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <Avatar username={chat.username} size={48} />
            <div className="min-w-0">
              <div className="font-semibold truncate">@{chat.username}</div>
              <div className="text-gray-500 text-sm truncate">
                {chat.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
);

ChatList.displayName = "ChatList";

export default ChatList;
