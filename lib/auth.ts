import {jwtVerify} from "jose";
import {db} from "@/db";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface JWTUser {
  username: string;
  name: string;
  email?: string;
  description?: string | null;
}

export async function getJWTUser(cookieStore: ReadonlyRequestCookies): Promise<JWTUser | null> {
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.username, payload.sub as string),
      columns: {
        username: true,
        name: true,
        email: true,
        description: true,
      },
    });
    return user || null;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}
