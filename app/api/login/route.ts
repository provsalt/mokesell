import {z} from "zod";
import {loginSchema} from "@/lib/schemas";
import {db} from "@/db";
import {usersTable} from "@/db/schema";
import bcrypt from "bcrypt";
import {SignJWT} from "jose";
import {sql} from "drizzle-orm";

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token.
 *     description: Authenticates a user by validating their email and password. If successful, returns a JWT token and user details.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully authenticated the user. Returns user details and sets a JWT token in a cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The username of the authenticated user.
 *                     name:
 *                       type: string
 *                       description: The name of the authenticated user.
 *                     email:
 *                       type: string
 *                       description: The email of the authenticated user.
 *                     description:
 *                       type: string
 *                       description: A description or bio of the authenticated user.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: JWT token stored in an HttpOnly, Secure, and SameSite=Strict cookie.
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; path=/; HttpOnly; SameSite=Strict; Secure;
 *       422:
 *         description: Authentication failed due to invalid input, incorrect email, or incorrect password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Error
 */

export const POST = async (request: Request): Promise<Response> => {
  const req: z.infer<typeof loginSchema> = await request.json();
  const error = (body: string | null) => {
    return new Response(body, {
      status: 422
    })
  }

  if (!loginSchema.safeParse(req).success) {
    return error(null);
  }

  try {
    const data = await db.query.usersTable.findFirst({
      where: sql`${usersTable.email}
      =
      ${req.email}`
    })
    if (!data) {
      // hide debug info, use generic error
      return error(null)
    }
    if (!await bcrypt.compare(req.password, data.password)) {
      return error(null)
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const tok = await new SignJWT({
      sub: data.username,
      name: data.name
    })
      .setProtectedHeader({alg: "HS256"})
      .setExpirationTime("1d")
      .sign(secret);
    return new Response(JSON.stringify({
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
        description: data.description
      }
    }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": `token=${tok}; path=/; HttpOnly; SameSite=Strict; Secure;`,
      }
    })
  } catch (e) {
    console.log(e)
    return error(JSON.stringify({
      "success": false,
      "error": "Error"
    }));
  }
}