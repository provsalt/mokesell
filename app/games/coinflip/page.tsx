import CoinFlip from "@/components/games/CoinFlip";
import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const Page = async () => {
  const user = await getJWTUser(await cookies());
  if (!user) redirect("/login");
  const [profile] = await db
    .select({
      balance: usersTable.balance,
    })
    .from(usersTable)
    .where(eq(usersTable.username, user.username));
  return <CoinFlip balance={parseFloat(profile.balance ?? "")} />;
};

export default Page;
