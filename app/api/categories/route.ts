import { NextResponse } from "next/server";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema";
import { z } from "zod";
import { getJWTUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import {cookies} from "next/headers";

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
});


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Electronics"
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: Category created
 *       409:
 *         description: Category already exists
 */
export async function POST(request: Request) {
  const user = await getJWTUser(await cookies());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 422 });
    }

    const existing = await db.query.categoriesTable.findFirst({
      where: eq(categoriesTable.name, validation.data.name),
    });

    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const [category] = await db.insert(categoriesTable)
      .values(validation.data)
      .returning();

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
export async function GET() {
  try {
    const categories = await db.select().from(categoriesTable);
    return NextResponse.json({ data: categories }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}