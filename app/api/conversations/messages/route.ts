import { z } from "zod";
import { db } from "@/db";
import { messagesTable, conversationTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJWTUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const createMessageSchema = z.object({
  content: z.string().min(1),
  conversationId: z.number().int().positive(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMessage:
 *       type: object
 *       required:
 *         - content
 *         - conversationId
 *       properties:
 *         content:
 *           type: string
 *           example: "Hello, how are you?"
 *         conversationId:
 *           type: number
 *           example: 1
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         content:
 *           type: string
 *           example: Hello
 *         sentAt:
 *           type: string
 *           format: date-time
 *           example: 2025-02-01T12:16:20.358Z
 *         readAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         conversationId:
 *           type: number
 *           example: 1
 *         senderUsername:
 *           type: string
 */

/**
 * @swagger
 * /api/conversations/messages:
 *   post:
 *     summary: Create a new message for a conversation
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessage'
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Conversation not found or bad request
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
export const POST = async (request: Request) => {
  const user = await getJWTUser(await cookies());
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 422 });
    }

    const { content, conversationId } = parsed.data;

    const conversation = await db
      .select()
      .from(conversationTable)
      .where(eq(conversationTable.id, conversationId))
      .limit(1);

    if (conversation.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 400 },
      );
    }

    // time added by now function by default.
    const [message] = await db
      .insert(messagesTable)
      .values({
        content,
        conversationId,
        senderUsername: user.username,
      })
      .returning();
    await db
      .update(conversationTable)
      .set({ updatedAt: sql`NOW()` })
      .where(eq(conversationTable.id, conversationId));
    revalidatePath("/chats", "layout");
    revalidatePath("/chats/[id]", "layout");

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

/**
 * @swagger
 * /api/conversations/messages:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: number
 *         description: Conversation id to fetch messages for.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit number of messages returned.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: Offset for pagination.
 *     responses:
 *       200:
 *         description: List of messages for the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Missing or invalid conversationId
 *       401:
 *         description: Unauthorized user
 *       403:
 *         description: Forbidden - user is not a participant
 */

export const GET = async (request: Request) => {
  try {
    const user = await getJWTUser(await cookies());
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        {
          error: "Missing conversationId in query parameters",
        },
        { status: 400 },
      );
    }

    const conversationResult = await db
      .select({
        id: conversationTable.id,
        buyerUsername: conversationTable.buyerUsername,
        sellerUsername: conversationTable.sellerUsername,
      })
      .from(conversationTable)
      .where(eq(conversationTable.id, Number(conversationId)))
      .limit(1);

    if (conversationResult.length === 0) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 400 },
      );
    }

    const conversation = conversationResult[0];

    if (
      conversation.buyerUsername !== user.username &&
      conversation.sellerUsername !== user.username
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 20;
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 0;

    const messages = await db
      .select({
        id: messagesTable.id,
        content: messagesTable.content,
        sentAt: messagesTable.sentAt,
        readAt: messagesTable.readAt,
        conversationId: messagesTable.conversationId,
        senderUsername: messagesTable.senderUsername,
      })
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, Number(conversationId)))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data: messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
