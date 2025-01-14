import {z} from "zod";
import {signUpSchema} from "@/lib/schemas";
import {db} from "@/db";
import {usersTable} from "@/db/schema";
import bcrypt from "bcrypt";
import {SignJWT} from "jose";

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