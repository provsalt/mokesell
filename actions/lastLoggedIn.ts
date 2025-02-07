// this is a server actions file
// this will invoke an api call from the client side to the server and automatically parse the response
// into a type safe result. it also supports live migration for deployments using blue green deployments.
"use server";

import { db } from "@/db";
import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { usersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { kv } from "@vercel/kv";

export const getLastLoggedIn = async () => {
  const user = await getJWTUser(await cookies());
  if (!user) return;
  const cache = await kv.get(`${user.username}:lastonline`);
  if (!cache) {
    return [
      db
        .select({ lastActive: usersTable.lastActive })
        .from(usersTable)
        .where(eq(usersTable.username, user.username)),
    ];
  }
  return new Date(cache as string);
};

export const setLastLoggedIn = async () => {
  const user = await getJWTUser(await cookies());
  if (!user) return;

  if (await kv.get(`${user.username}:lastonline`)) return;

  const [lastOnline] = await db
    .update(usersTable)
    .set({ lastActive: sql`NOW()` })
    .where(eq(usersTable.username, user.username))
    .returning({ lastOnline: usersTable.lastActive });
  if (!lastOnline.lastOnline) return;
  console.log(
    await kv.set(
      `${user.username}:lastonline`,
      lastOnline.lastOnline.toISOString(),
      { ex: 60 * 5 },
    ),
  );
  return lastOnline.lastOnline;
};
