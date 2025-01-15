import {z} from "zod";
import {signUpSchema} from "@/lib/schemas";
import {db} from "@/db";
import {usersTable} from "@/db/schema";
import bcrypt from "bcrypt";
import {SignJWT} from "jose";

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user and return a JWT token.
 *     description: Registers a new user by validating their input, hashing their password, and storing their details in the database. If successful, returns a JWT token.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 description: The desired username for the user.
 *                 example: johndoe123
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully registered the user. Sets a JWT token in a cookie.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: JWT token stored in an HttpOnly, Secure, and SameSite=Strict cookie.
 *               example: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; path=/; HttpOnly; SameSite=Strict; Secure;
 *       422:
 *         description: Registration failed due to invalid input or a database error.
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
  const req: z.infer<typeof signUpSchema> = await request.json();
  const error = (body: string | null) => {
    return new Response(body, {
      status: 422
    })
  }
  if (!signUpSchema.safeParse(req).success) {
    return error(null);
  }

  const hashPassword = await bcrypt.hash(req.password, 12);
  try {
    await db.insert(usersTable).values({
      name: req.name,
      username: req.username,
      email: req.email,
      password: hashPassword,
      description: ""
    })
  } catch (e) {
    console.log(e)
    return error(JSON.stringify({
      "success": false,
      "error": "Error"
    }));
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
  const tok = await new SignJWT({
    sub: req.username,
    name: req.name
  })
    .setProtectedHeader({alg: "HS256"})
    .setExpirationTime("1d")
    .sign(secret);
  return new Response(null, {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": `token=${tok}; path=/; HttpOnly; SameSite=Strict; Secure;`,
    }
  })
}