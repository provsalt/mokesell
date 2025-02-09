import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

interface MessageProps {
  children: ReactNode;
  isSender: boolean;
}

export const Message: FC<MessageProps> = ({ children, isSender }) => {
  return (
    <div
      className={cn(
        "max-w-max p-3 px-4 rounded-xl text-white",
        "break-words",
        isSender ? "bg-blue-500 self-end" : "bg-gray-600 self-start",
      )}
    >
      {children}
    </div>
  );
};
