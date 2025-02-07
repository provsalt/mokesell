import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  categoriesTable,
  imagesTable,
  listingsTable,
  usersTable,
} from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";
import Image from "next/image";
import { addDays, formatDistance, isBefore } from "date-fns";
import { Mail, Star, Wallet } from "lucide-react";
import { ListingCard } from "@/components/Listing/ListingCard";
import { ClaimDailyRewardButton } from "@/components/Reward/ClaimDailyRewardButton";

const ProfilePage = async () => {
  const user = await getJWTUser(await cookies());
  if (!user) redirect("/login");

  // not using api here because lazy to encode and decode again. typesafety man, technically a backend api call lol.
  const [profile] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, user.username));

  const listings = await db
    .select({
      id: listingsTable.id,
      title: listingsTable.title,
      price: listingsTable.price,
      condition: listingsTable.condition,
      images:
        sql`json_agg(json_build_object('id', ${imagesTable.id}, 'url', ${imagesTable.url}, 'position', ${imagesTable.position}))`.as(
          "images",
        ),
    })
    .from(listingsTable)
    .where(eq(listingsTable.sellerUsername, profile.username))
    .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
    .leftJoin(imagesTable, eq(listingsTable.id, imagesTable.listingId))
    .groupBy(listingsTable.id, categoriesTable.name)
    .orderBy(desc(listingsTable.listedAt));
  const avatar = createAvatar(pixelArt, {
    size: 64,
    seed: profile.username,
  }).toDataUri();

  const canClaimDailyReward =
    profile.lastDailyReward === null ||
    isBefore(addDays(profile.lastDailyReward, 1), new Date());
  return (
    <div className="p-4 space-y-4">
      <div className="bg-gray-100 p-4 flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <Image
          src={avatar}
          alt={profile.username}
          width={128}
          height={128}
          className="rounded-full bg-white"
        />
        <div className="space-y-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-lg font-semibold text-blue-700">
              @{profile.username}
            </p>
          </div>
          <p>{profile.description || "Hey there, I'm using mokesell"}</p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <p>Joined {formatDistance(Date.now(), profile.createdAt)} ago</p>
              <p>
                Last seen{" "}
                {formatDistance(
                  Date.now(),
                  profile.lastActive || Date.UTC(1970),
                )}{" "}
                ago
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex gap-2">
                <Mail className="font-normal" />
                <p>{profile.email}</p>
              </div>
              <div className="flex gap-2">
                <Star className="font-normal" />
                <p>No reviews yet</p>
              </div>
              <div className="flex gap-2">
                <Wallet className="font-normal" />
                <p>${profile.balance}</p>
              </div>
            </div>
            {canClaimDailyReward && <ClaimDailyRewardButton />}
          </div>
        </div>
      </div>
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {listings.map((listing) => {
            const images = listing.images as
              | { id: number; url: string; position: number }[]
              | null;
            if (!images) return;
            const image = images.filter((image) => image.position === 1);
            return (
              <ListingCard
                id={listing.id}
                name={listing.title}
                condition={listing.condition}
                price={"$" + listing.price}
                image={image[0].url ?? ""}
                key={listing.id}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
