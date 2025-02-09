import React from "react";
import Image from "next/image";

interface ChatHeaderProps {
  listingTitle: string;
  listingImage?: string | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  listingTitle,
  listingImage,
}) => {
  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {listingImage ? (
          <Image
            width={64}
            height={64}
            src={listingImage}
            alt="Listing"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        )}
        <div className="font-medium truncate">{listingTitle}</div>
      </div>
    </div>
  );
};
