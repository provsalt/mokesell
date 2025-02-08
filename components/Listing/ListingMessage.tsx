"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ListingMessageProps {
  listingId: number;
  initialOffer: number;
}

const ListingMessage: React.FC<ListingMessageProps> = ({
  listingId,
  initialOffer,
}) => {
  const router = useRouter();
  const [offer, setOffer] = useState(initialOffer);
  const [loading, setLoading] = useState(false);

  const startChat = async () => {
    setLoading(true);
    try {
      console.log("Creating conversation for listing:", listingId);

      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Failed to create conversation: ${errorResponse.message || "Unknown error"}`,
        );
      }

      router.push(`/chats`);
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button className="w-full" onClick={startChat} disabled={loading}>
        {loading ? "Starting chat..." : "Message"}
      </Button>

      <div className="flex gap-2">
        <Input
          type="number"
          value={offer}
          onChange={(e) => setOffer(Number(e.target.value))}
          className="flex-1"
        />
        <Button className="bg-blue-500" onClick={startChat} disabled={loading}>
          {loading ? "Processing..." : `Make Offer ($${offer})`}
        </Button>
      </div>
    </div>
  );
};

export default ListingMessage;
