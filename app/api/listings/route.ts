import { db } from "@/db";
import { listingsTable, categoriesTable, imagesTable } from "@/db/schema";
import { eq, and, gte, lte, desc, sql, ilike } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJWTUser } from "@/lib/auth";
import { uploadToS3 } from "@/lib/s3";
import { createListingSchema } from "@/lib/schemas";
import sharp from "sharp";

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
 *           enum: [new, like_new, used, heavily_used]
 *           example: "used"
 *         categoryId:
 *           type: integer
 *         deliveryCost:
 *           type: string
 *           pattern: ^\d+(\.\d{1,2})?$
 *           example: "10.00"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Array of image files (max 10 images)
 *
 *     ListingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: string
 *         condition:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateListing'
 *     responses:
 *       201:
 *         description: Listing created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListingResponse'
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */

export const POST = async (request: Request) => {
  const user = await getJWTUser(await cookies());
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();

    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      condition: formData.get("condition"),
      categoryId: Number(formData.get("categoryId")),
      deliveryCost: formData.get("deliveryCost") ?? undefined,
      images: formData.getAll("images"),
    };

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    const validation = createListingSchema.safeParse({
      ...body,
      images: formData.getAll("images"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 422 },
      );
    }

    const { categoryId, ...data } = validation.data;
    const category = await db.query.categoriesTable.findFirst({
      where: eq(categoriesTable.id, categoryId),
    });
    if (!category)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 },
      );

    const imageFiles = formData.getAll("images") as File[];
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        // Validate file type
        if (!allowedImageTypes.includes(file.type)) {
          throw new Error(
            `Invalid file type: ${file.type}. Only JPEG, PNG, and WEBP formats are allowed.`,
          );
        }

        const optimizedBuffer = await sharp(
          Buffer.from(await file.arrayBuffer()),
        )
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        return uploadToS3(optimizedBuffer, file.name, file.type);
      }),
    );

    const [listing] = await db
      .insert(listingsTable)
      .values({
        ...data,
        categoryId,
        sellerUsername: user.username,
      })
      .returning();

    await Promise.all(
      imageUrls.map((url) =>
        db.insert(imagesTable).values({
          url,
          listingId: listing.id,
          position: imageUrls.indexOf(url) + 1,
        }),
      ),
    );

    return NextResponse.json({ data: listing }, { status: 201 });
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
 *           enum: [new, like_new, used, heavily_used]
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of listings
 */
export const GET = async (request: Request) => {
  try {
    // best practice: add pagination or remove unnecessary api details to lessen network payload. but this is fine for now.
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const condition = searchParams.get("condition");
    const query = searchParams.get("query");

    const listings = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        price: listingsTable.price,
        condition: listingsTable.condition,
        category: categoriesTable.name,
        listedAt: listingsTable.listedAt,
        sellerUsername: listingsTable.sellerUsername,
        images:
          sql`json_agg(json_build_object('id', ${imagesTable.id}, 'url', ${imagesTable.url}, 'position', ${imagesTable.position}))`.as(
            "images",
          ),
      })
      .from(listingsTable)
      .leftJoin(
        categoriesTable,
        eq(listingsTable.categoryId, categoriesTable.id),
      )
      .leftJoin(imagesTable, eq(listingsTable.id, imagesTable.listingId))
      .where(
        and(
          categoryId
            ? eq(listingsTable.categoryId, Number(categoryId))
            : undefined,
          minPrice ? gte(listingsTable.price, minPrice) : undefined,
          maxPrice ? lte(listingsTable.price, maxPrice) : undefined,
          condition ? eq(listingsTable.condition, condition) : undefined,
          query ? ilike(listingsTable.title, `%${query}%`) : undefined,
        ),
      )
      .groupBy(listingsTable.id, categoriesTable.name)
      .orderBy(desc(listingsTable.listedAt));

    return NextResponse.json({ data: listings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
