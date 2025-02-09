"use client";

import { useState } from "react";
import { ChatMessages } from "@/components/Chat/ChatMessages";
import { ChatInput } from "@/components/Chat/ChatInput";
import { sendMessage } from "@/actions/chat";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const ContactPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (messageContent: string) => {
    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: messageContent },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call the sendMessage action to get AI response
      const response = await sendMessage(newMessages);

      // Add AI response onto the conversation
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: response || "Sorry, I couldn't process that.",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format messages for ChatMessages component
  const formattedMessages = messages.map((msg, index) => ({
    id: index,
    content: msg.content,
    senderUsername: msg.role,
  }));

  return (
    <div className="container mx-auto p-8 flex-1 flex flex-col">
      <div className="flex flex-col items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-gray-500">
          We are here to help you. If you have any questions, please use our
          chat feature here.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
        <ChatMessages messages={formattedMessages} currentUsername="user" />
        <ChatInput onSend={handleSendMessage} />
        {isLoading && (
          <div className="p-4 text-center text-gray-500">John is typing...</div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
