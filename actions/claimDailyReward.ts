"use server";

import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { addDays, isBefore } from "date-fns";
import { revalidatePath } from "next/cache";

export const claimDailyReward = async () => {
  const user = await getJWTUser(await cookies());
  if (!user) return;
  const [claim] = await db
    .select({ lastDailyReward: usersTable.lastDailyReward })
    .from(usersTable)
    .where(eq(usersTable.username, user.username));

  const now = new Date();
  if (claim.lastDailyReward) {
    const nextEligibleTime = addDays(new Date(claim.lastDailyReward), 1);
    if (!isBefore(nextEligibleTime, now)) {
      return false;
    }
  }
  await db
    .update(usersTable)
    .set({ lastDailyReward: now, balance: sql`${usersTable.balance} + 0.01` })
    .where(eq(usersTable.username, user.username));
  revalidatePath("/profile");
  return true;
};
