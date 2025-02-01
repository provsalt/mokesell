import { NextResponse } from "next/server";
import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateMessageSchema = z.object({
  readAt: z.date().optional(),
});

/**
 * @swagger
 * /api/conversations/messages/{id}:
 *   patch:
 *     summary: Update a message read status
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Message ID to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               readAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-01T07:27:00Z"
 *     responses:
 *       200:
 *         description: Message updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Bad Request
 */
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid message id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = updateMessageSchema.safeParse({
      ...body,
      readAt: body.readAt ? new Date(body.readAt) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 422 });
    }

    const [updatedMessage] = await db
      .update(messagesTable)
      .set({ readAt: parsed.data.readAt })
      .where(eq(messagesTable.id, id))
      .returning();

    if (!updatedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ data: updatedMessage }, { status: 200 });
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
 * /api/conversations/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Message ID to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid message id" },
        { status: 400 },
      );
    }

    const [deletedMessage] = await db
      .delete(messagesTable)
      .where(eq(messagesTable.id, id))
      .returning();

    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ data: deletedMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
