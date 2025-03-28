import { db } from "@/db";
import { conversationTable, imagesTable, listingsTable, messagesTable } from "@/db/schema";
import {eq, sql } from "drizzle-orm";
import { ChatHeader } from "@/components/Chat/ChatHeader"
import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {ChatContent} from "@/components/Chat/ChatContent";

export const revalidate = 3600;

const Chat = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await getJWTUser(await cookies());
  if (!user) redirect("/login");

  // using server here to fetch db first for faster user experience.
  const conversationResult = await db
    .select({
      id: conversationTable.id,
      buyerUsername: conversationTable.buyerUsername,
      sellerUsername: conversationTable.sellerUsername,
    })
    .from(conversationTable)
    .where(eq(conversationTable.id, Number((await params).id)))
    .limit(1);

  if (conversationResult.length === 0) {
    redirect("/not_found")
  }

  const conversation = conversationResult[0];

  if (
    conversation.buyerUsername !== user.username &&
    conversation.sellerUsername !== user.username
  ) {
    redirect("/not_found") 
  }

  const messages = await db
    .select({
      id: messagesTable.id,
      content: messagesTable.content,
      sentAt: messagesTable.sentAt,
      readAt: messagesTable.readAt,
      senderUsername: messagesTable.senderUsername,
    })
    .from(messagesTable)
    .leftJoin(conversationTable, eq(messagesTable.conversationId, conversationTable.id))
    .leftJoin(listingsTable, eq(conversationTable.listingId, listingsTable.id))
    .where(eq(messagesTable.conversationId, Number((await params).id)))

  const [listing] = await db
    .select({
      id: listingsTable.id,
      title: listingsTable.title,
      price: listingsTable.price,
      images: sql`json_agg(json_build_object('id', ${imagesTable.id}, 'url', ${imagesTable.url}, 'position', ${imagesTable.position}))`.as("images")
    })
    .from(listingsTable)
    .leftJoin(imagesTable, eq(listingsTable.id, imagesTable.listingId))
    .innerJoin(conversationTable, eq(conversationTable.listingId, listingsTable.id))
    .where(eq(conversationTable.id, Number((await params).id)))
    .groupBy(listingsTable.id);

  const images = listing.images as
    | { id: number; url: string; position: number }[]
    | null;
  if (!images) return;
  const image = images.filter((image) => image.position === 1);

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader listingTitle={listing.title} listingImage={image[0].url ?? ""} />
      <ChatContent user={user} messages={messages} conversationId={(await params).id} />
    </div>
  )

}

export default Chat;