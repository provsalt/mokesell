"use client";

import useSWR, { Fetcher } from "swr";
import { ChatMessages } from "@/components/Chat/ChatMessages";
import { ChatInput } from "@/components/Chat/ChatInput";
import { JWTUser } from "@/lib/auth";

type Message = {
  id: number;
  content: string;
  senderUsername: string;
};

export const ChatContent = (props: {
  user: JWTUser;
  messages: Message[];
  conversationId: string;
}) => {
  const fetcher: Fetcher<Message[], string> = (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((r) => r.data);

  const {
    data: messagesData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/api/conversations/messages?conversationId=${props.conversationId}`,
    fetcher,
    {
      fallbackData: props.messages,
      revalidateOnFocus: true,
      refreshInterval: 15 * 1000,
    },
  );

  const handleSendMessage = async (messageContent: string) => {
    // temporary id using epoch
    const newMessage: Message = {
      id: Date.now(),
      content: messageContent,
      senderUsername: props.user.username,
    };

    const updatedMessages = [...(messagesData || []), newMessage];
    mutate(updatedMessages, false);

    const res = await fetch("/api/conversations/messages", {
      method: "POST",
      body: JSON.stringify({
        conversationId: Number(props.conversationId),
        content: messageContent,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Error sending message:", res.status);
    }

    mutate();
  };

  if (error) {
    return <p>Error loading messages.</p>;
  }

  if (isLoading) return <p>Loading</p>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ChatMessages
          currentUsername={props.user.username}
          messages={messagesData}
        />
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};
