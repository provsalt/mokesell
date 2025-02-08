import React from "react";
import { cn } from "@/lib/utils";

interface MessageProps {
  text: string;
  isSender: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isSender }) => {
  return (
    <div
      className={cn(
        "max-w-[75%] md:max-w-[60%] lg:max-w-[50%] p-3 rounded-xl text-white",
        "break-words",
        isSender ? "bg-blue-500 self-end" : "bg-gray-600 self-start",
      )}
      style={{ wordBreak: "break-word" }}
    >
      {text}
    </div>
  );
};

export default Message;
