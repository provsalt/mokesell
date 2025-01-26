import { NextApiRequest, NextApiResponse } from 'next'
import { ilike } from 'drizzle-orm'
import {db} from "@/db";
import {listingsTable} from "@/db/schema";
import {NextResponse} from "next/server";
/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Fuzzy search listings
 *     description: Returns matching listings by fuzzy match on the title
 *     parameters:
 *       - in: query
 *         name: q
 *         description: The search query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of matching listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
export const GET = async (request: NextApiRequest): Promise<Response> => {

  const { q } = request.query
  const results = await db.select().from(listingsTable).where(
    ilike(listingsTable.title, `%${q}%`)
  )
  return NextResponse.json(results)
}