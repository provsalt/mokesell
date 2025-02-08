import React from "react";
import { Message } from "@/components/Chat/Message";

interface ChatMessagesProps {
  messages: { id: number; content: string; senderUsername: string }[];
  currentUsername: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUsername,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : (
        <div className="">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              isSender={msg.senderUsername === currentUsername}
            >
              {msg.content}
            </Message>
          ))}
        </div>
      )}
    </div>
  );
};
