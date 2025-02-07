"use client";
import React from "react";
import { Search, SendHorizontal, MessageCircle } from "lucide-react";

// interface Message {
//   id: number;
//   content: string;
//   sentAt: string;
//   readAt: string;
//   conversationId: number;
//   senderUsername: string;
// }

// interface Conversation {
//   id: number;
//   listingId: number;
//   buyerUsername: string;
//   sellerUsername: string;
//   createdAt: string;
//   updatedAt: string;
// }

export default function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [selectedChat, setSelectedChat] = React.useState<number | null>(null);

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

  const ChatContent = () => (
    <>
      <div className="p-4 border-b bg-white z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="font-medium truncate"></div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 max-w-2xl mx-auto">{/* messages here */}</div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full pl-4 pr-12 py-3 rounded-lg border"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <SendHorizontal className="point w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>
    </>
  );

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
        className={`
        fixed lg:static inset-y-0 left-0 w-full sm:w-80 lg:w-96 
        transform lg:transform-none transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-gray-50 border-r z-40 flex flex-col
      `}
      >
        <div className="p-4 bg-gray-50 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Chat"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3].map((chatId) => (
            <div
              key={chatId}
              onClick={() => {
                setSelectedChat(chatId);
                setIsSidebarOpen(false);
              }}
              className={`
                flex items-center gap-3 p-4 cursor-pointer transition-colors
                ${selectedChat === chatId ? "bg-gray-200 rounded-lg mx-2" : "hover:bg-gray-100"}
              `}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium truncate">User {chatId}</div>
                <div className="text-gray-500 text-sm truncate">
                  Last message preview...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat ? <ChatContent /> : <WelcomeScreen />}
      </div>
    </div>
  );
}
