import { z } from "zod";
import { db } from "@/db";
import { listingsTable, categoriesTable } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import {cookies} from "next/headers";
import {getJWTUser} from "@/lib/auth";

const createListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  condition: z.enum(["new", "like_new", "used", "heavily used"]),
  categoryId: z.number().int().positive(),
  deliveryCost: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
});


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateListing:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - condition
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           example: "Macbook Air"
 *         description:
 *           type: string
 *           example: "Macbook Air M1 willing to let go fast deal $700"
 *         price:
 *           type: string
 *           pattern: ^\d+(\.\d{1,2})?$
 *           example: "700"
 *         condition:
 *           type: string
 *           enum: [new, like_new, used, heavily used]
 *           example: "used"
 *         categoryId:
 *           type: integer
 *           example: 2
 *         deliveryCost:
 *           type: string
 *           pattern: ^\d+(\.\d{1,2})?$
 *           example: "10.00"
 */

/**
 * @swagger
 * /api/listings:
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListing'
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
export async function POST(request: Request) {
  const user = await getJWTUser(await cookies());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validation = createListingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 422 });
    }

    const { categoryId, ...data } = validation.data;
    const category = await db.query.categoriesTable.findFirst({ where: eq(categoriesTable.id, categoryId) });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });

    const [listing] = await db.insert(listingsTable).values({
      ...data,
      categoryId,
      sellerUsername: user.username,
    }).returning();

    return NextResponse.json({ data: listing }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Get all listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [new, like_new, used, heavily used]
 *     responses:
 *       200:
 *         description: List of listings
 */
export async function GET(request: Request) {
  try {
    // best practice: add pagination or remove unnecessary api details to lessen network payload. but this is fine for now.
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');

    const listings = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        price: listingsTable.price,
        condition: listingsTable.condition,
        category: categoriesTable.name,
        listedAt: listingsTable.listedAt,
        sellerUsername: listingsTable.sellerUsername,
      })
      .from(listingsTable)
      .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
      .where(and(
        categoryId ? eq(listingsTable.categoryId, Number(categoryId)) : undefined,
        minPrice ? gte(listingsTable.price, minPrice) : undefined,
        maxPrice ? lte(listingsTable.price, maxPrice) : undefined,
        condition ? eq(listingsTable.condition, condition) : undefined,
      ))
      .orderBy(desc(listingsTable.listedAt));

    return NextResponse.json({ data: listings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}