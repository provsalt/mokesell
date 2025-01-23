import { NextResponse } from "next/server";
import { db } from "@/db";
import { listingsTable, categoriesTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import {z} from "zod";
import {cookies} from "next/headers";
import {getJWTUser} from "@/lib/auth";

const updateListingSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  condition: z.enum(["new", "like_new", "used", "heavily used"]).optional(),
  categoryId: z.number().int().positive().optional(),
  deliveryCost: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().nullable(),
  status: z.enum(["active", "sold", "expired"]).optional(),
});

/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     summary: Get a single listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listing details
 *       404:
 *         description: Listing not found
 */
export const GET = async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const listingId = parseInt((await params).id);
    if (isNaN(listingId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [listing] = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        description: listingsTable.description,
        price: listingsTable.price,
        condition: listingsTable.condition,
        category: categoriesTable.name,
        deliveryCost: listingsTable.deliveryCost,
        status: listingsTable.status,
        listedAt: listingsTable.listedAt,
        seller: {
          username: usersTable.username,
          name: usersTable.name,
        },
      })
      .from(listingsTable)
      .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
      .leftJoin(usersTable, eq(listingsTable.sellerUsername, usersTable.username))
      .where(eq(listingsTable.id, listingId));

    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json({ data: listing }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateListing:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Macbook Air M1"
 *         description:
 *           type: string
 *           example: "Macbook M1 willing to let go for $700 with accessories and a box"
 *         price:
 *           type: string
 *           pattern: ^\d+(\.\d{1,2})?$
 *           example: "690"
 *         condition:
 *           type: string
 *           enum: [new, like_new, used, heavily used]
 *           example: "used"
 *         categoryId:
 *           type: integer
 *           example: 2
 *         deliveryCost:
 *           type: string
 *           nullable: true
 *           pattern: ^\d+(\.\d{1,2})?$
 *           example: "12.50"
 *         status:
 *           type: string
 *           enum: [active, sold, expired]
 *           example: "active"
 */

/**
 * @swagger
 * /api/listings/{id}:
 *   put:
 *     summary: Update a listing
 *     tags: [Listings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateListing'
 *     responses:
 *       200:
 *         description: Listing updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Listing not found
 */
export const PUT = async (request: Request, { params }: { params: Promise<{ id: string } >}) => {
  const user = await getJWTUser(await cookies());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const listingId = parseInt((await params).id);
    if (isNaN(listingId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await request.json();
    const validation = updateListingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 422 });
    }

    const listing = await db.query.listingsTable.findFirst({
      where: eq(listingsTable.id, listingId),
    });

    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.sellerUsername !== user.username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [updatedListing] = await db
      .update(listingsTable)
      .set(validation.data)
      .where(eq(listingsTable.id, listingId))
      .returning();

    return NextResponse.json({ data: updatedListing }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     summary: Delete a listing
 *     tags: [Listings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Listing deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Listing not found
 */
export const DELETE = async (_: Request, { params }: { params: Promise < { id: string } > }) => {
  const user = await getJWTUser(await cookies());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const listingId = parseInt((await params).id);
    if (isNaN(listingId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const listing = await db.query.listingsTable.findFirst({
      where: eq(listingsTable.id, listingId),
    });

    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.sellerUsername !== user.username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(listingsTable).where(eq(listingsTable.id, listingId));
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}