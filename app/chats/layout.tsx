import { db } from "@/db";
import { conversationTable } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { ChatSidebar } from "@/components/Chat/ChatSideBar";

const ChatLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getJWTUser(await cookies());

  if (!user) return <div>Unauthorized</div>;

  const conversations = await db
    .select({
      id: conversationTable.id,
      listingId: conversationTable.listingId,
      buyerUsername: conversationTable.buyerUsername,
      sellerUsername: conversationTable.sellerUsername,
      createdAt: conversationTable.createdAt,
      updatedAt: conversationTable.updatedAt,
    })
    .from(conversationTable)
    .where(
      or(
        eq(conversationTable.buyerUsername, user.username),
        eq(conversationTable.sellerUsername, user.username),
      ),
    )
    .orderBy(desc(conversationTable.updatedAt));
  return (
    <div className="flex flex-1 pt-5">
      <ChatSidebar conversations={conversations} />
      {children}
    </div>
  );
};

export default ChatLayout;
