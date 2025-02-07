"use server";

import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { usersTable } from "@/db/schema";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const PlayCoinFlip = async (
  amount: number,
  guess: "heads" | "tails",
) => {
  const user = await getJWTUser(await cookies());

  if (!user)
    return {
      success: false,
    };

  if (amount < 0)
    return {
      success: false,
    };

  const [balance] = await db
    .select({
      balance: usersTable.balance,
    })
    .from(usersTable)
    .where(eq(usersTable.username, user.username));

  if (!balance.balance) {
    return {
      success: false,
    };
  }

  if (amount > parseFloat(balance.balance)) {
    return { success: false };
  }

  const random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  const possibleValues = ["heads", "tails"];
  const result = possibleValues[(random() * possibleValues.length) | 0];
  if (result === guess) {
    await db
      .update(usersTable)
      .set({
        balance: sql`${usersTable.balance} + ${amount}`,
      })
      .where(eq(usersTable.username, user.username));
    revalidatePath("/profile");
    revalidatePath("/games/coinflip");
    return {
      success: true,
      result: result,
    };
  }

  await db
    .update(usersTable)
    .set({
      balance: sql`${usersTable.balance} - ${amount}`,
    })
    .where(eq(usersTable.username, user.username));

  revalidatePath("/profile");
  revalidatePath("/games/coinflip");
  return {
    success: true,
    result: result,
  };
};
