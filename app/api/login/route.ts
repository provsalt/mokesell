import {z} from "zod";
import {loginSchema} from "@/lib/schemas";
import {db} from "@/db";
import {usersTable} from "@/db/schema";
import bcrypt from "bcrypt";
import {SignJWT} from "jose";
import {sql} from "drizzle-orm";

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