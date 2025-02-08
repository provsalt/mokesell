"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

export const ChatInput: React.FC = () => {
  const [messageInput, setMessageInput] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    console.log("Message sent:", messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={sendMessage} className="flex">
        <Input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="w-full pl-4 pr-12 py-3 rounded-lg border"
        />
        <Button type="submit">
          <SendHorizontal className="hover:text-gray-300 w-6 h-6 text-gray-50" />
        </Button>
      </form>
    </div>
  );
};
