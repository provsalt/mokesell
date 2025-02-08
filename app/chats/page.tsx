"use client";
import React, { useEffect, useState } from "react";
import ChatList from "@/components/Chat/ChatList";
import Message from "@/components/Chat/Message";
import { Search, SendHorizontal, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sentAt: string;
  senderUsername: string;
}

interface Conversation {
  id: number;
  buyerUsername: string;
  sellerUsername: string;
  lastMessage: string;
}

export default function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string>("");

  // Fetch current user's username on component mount
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setCurrentUsername(data.username);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
    fetchCurrentUser();
  }, []);

  // Fetch all chats
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch("/api/conversations");
        const jsonResponse = await response.json();

        if (Array.isArray(jsonResponse.data)) {
          setConversations(jsonResponse.data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }
    fetchConversations();
  }, []);

  // Load messages for selected chat
  const loadMessages = async (chatId: number) => {
    setSelectedChat(chatId);
    await fetchMessages(chatId);
  };

  // Fetch messages for the selected chat
  const fetchMessages = async (conversationId: number) => {
    setLoadingMessages(true);
    try {
      const response = await fetch(
        `/api/conversations/messages?/${conversationId}`,
      );
      const jsonResponse = await response.json();
      if (Array.isArray(jsonResponse.data)) {
        setMessages(jsonResponse.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Poll for new messages
  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => fetchMessages(selectedChat), 60000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  // Send message and update UI
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      const response = await fetch(`/api/conversations/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageInput,
          conversationId: selectedChat,
          senderUsername: currentUsername,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();

      setMessages((prev) => [...prev, newMessage]);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedChat
            ? { ...conv, lastMessage: messageInput }
            : conv,
        ),
      );

      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const WelcomeScreen = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="font-medium">Mokesell</h2>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Start Finding Your Best Offers Now!
        </h1>
        <p className="text-gray-600">Select a chat to begin messaging</p>
      </div>
    </div>
  );

  const ChatContent = () => {
    const selectedConversation = conversations.find(
      (c) => c.id === selectedChat,
    );
    const otherUsername = selectedConversation
      ? currentUsername === selectedConversation.buyerUsername
        ? selectedConversation.sellerUsername
        : selectedConversation.buyerUsername
      : "Unknown User";

    return (
      <>
        <div className="p-4 border-b bg-white z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="font-medium truncate">{otherUsername}</div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {loadingMessages && messages.length === 0 ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto flex flex-col">
              {messages.map((msg) => (
                <Message
                  key={msg.id} // Ensure this ID is unique
                  text={msg.content}
                  isSender={msg.senderUsername === currentUsername}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full pl-4 pr-12 py-3 rounded-lg border"
            />
            <button
              onClick={() => sendMessage()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <SendHorizontal className="hover:text-gray-700 w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden pt-5">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 bg-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat List Sidebar */}
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
              currentUsername === chat.buyerUsername
                ? chat.sellerUsername
                : chat.buyerUsername,
            lastMessage: chat.lastMessage || "No messages yet",
          }))}
          selectedChatId={selectedChat}
          onSelectChat={(chatId) => {
            loadMessages(chatId);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat ? <ChatContent /> : <WelcomeScreen />}
      </div>
    </div>
  );
}
