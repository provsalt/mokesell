import { z } from "zod";
import { db } from "@/db";
import { conversationTable, listingsTable } from "@/db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJWTUser } from "@/lib/auth";

const createConversationSchema = z.object({
  listingId: z.number().int().positive(),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateConversation:
 *       type: object
 *       required:
 *         - listingId
 *       properties:
 *         listingId:
 *           type: number
 *           example: 123
 *
 *     ConversationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         listingId:
 *           type: number
 *         buyerUsername:
 *           type: string
 *         sellerUsername:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create a new conversation for a listing
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateConversation'
 *     responses:
 *       201:
 *         description: Conversation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       400:
 *         description: Listing not found or conversation already exists
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
    const parsed = createConversationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 422 });
    }

    const { listingId } = parsed.data;

    const listings = await db
      .select({
        id: listingsTable.id,
        sellerUsername: listingsTable.sellerUsername,
      })
      .from(listingsTable)
      .where(eq(listingsTable.id, listingId))
      .limit(1);

    if (listings.length === 0) {
      return NextResponse.json({ error: "Listing not found" }, { status: 400 });
    }

    const listing = listings[0];

    if (listing.sellerUsername === user.username)
      return NextResponse.json(
        {
          error: "Unable to create a conversation with the same user",
        },
        { status: 422 },
      );

    // prevent duplicate conversation
    const existingConversation = await db
      .select()
      .from(conversationTable)
      .where(
        and(
          eq(conversationTable.listingId, listingId),
          eq(conversationTable.buyerUsername, user.username),
          eq(conversationTable.sellerUsername, listing.sellerUsername),
        ),
      )
      .limit(1);

    if (existingConversation.length > 0) {
      return NextResponse.json(
        { error: "Conversation already exists" },
        { status: 400 },
      );
    }

    const [conversation] = await db
      .insert(conversationTable)
      .values({
        listingId,
        buyerUsername: user.username,
        sellerUsername: listing.sellerUsername,
      })
      .returning();

    return NextResponse.json({ data: conversation }, { status: 201 });
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
 * /api/conversations:
 *   get:
 *     summary: Get the list of conversations for the authenticated user
 *     tags: [Conversations]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of conversations returned.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: Offset for pagination.
 *     responses:
 *       200:
 *         description: List of conversations for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   listingId:
 *                     type: number
 *                   buyerUsername:
 *                     type: string
 *                   sellerUsername:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const GET = async (request: Request) => {
  try {
    const user = await getJWTUser(await cookies());
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 20;
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 0;

    // Select conversations where the authenticated user is either the buyer or seller.
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
      .limit(limit)
      .offset(offset)
      .orderBy(desc(conversationTable.updatedAt));

    return NextResponse.json({ data: conversations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
