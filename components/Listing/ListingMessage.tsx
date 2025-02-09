"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FC, useContext, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import { useToast } from "@/components/ui/use-toast";

interface ListingMessageProps {
  listingId: number;
  sellerUsername: string;
  initialOffer: number;
}

interface Conversation {
  id: number;
  listingId: number;
  buyerUsername: string;
  sellerUsername: string;
}

const ListingMessage: FC<ListingMessageProps> = ({
  listingId,
  sellerUsername,
  initialOffer,
}) => {
  const router = useRouter();
  const [offer, setOffer] = useState(initialOffer);
  const [loading, setLoading] = useState(false);
  const [user] = useContext(UserContext);
  const { toast } = useToast();

  const startChat = async () => {
    setLoading(true);
    try {
      if (user?.username === sellerUsername) {
        toast({ variant: "destructive", title: "You can't message yourself" });
        return;
      }

      // Fetch existing conversations
      const checkRes = await fetch("/api/conversations");
      if (!checkRes.ok)
        throw new Error("Failed to check existing conversations");

      const conversations: Conversation[] = (await checkRes.json()).data;
      console.log("Fetched conversations:", conversations);

      if (Array.isArray(conversations)) {
        const existingConversation = conversations.find(
          (conv) =>
            conv.sellerUsername === sellerUsername &&
            conv.listingId === listingId,
        );

        if (existingConversation) {
          console.log("Existing conversation found:", existingConversation.id);
          router.push(`/chats`);
          return;
        }
      } else {
        console.error("Expected an array, but got:", conversations);
      }

      // conversation not found creates a new one
      console.log("No existing conversation found, creating a new one");

      const createRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, sellerUsername }),
      });

      if (!createRes.ok) {
        const errorResponse = await createRes.json();
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
          {loading ? "Processing..." : `Make Offer`}
        </Button>
      </div>
    </div>
  );
};

export default ListingMessage;
