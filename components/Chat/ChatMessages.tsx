import React, { useEffect, useRef } from "react";
import { Message } from "@/components/Chat/Message";

interface ChatMessagesProps {
  messages: { id: number; content: string; senderUsername: string }[];
  currentUsername: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUsername,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 max-h-[70svh] overflow-y-auto p-4"
    >
      <div className="flex flex-col space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <Message
              key={msg.id}
              isSender={msg.senderUsername === currentUsername}
            >
              {msg.content}
            </Message>
          ))
        )}
      </div>
    </div>
  );
};
