import { ListingFilters } from "@/components/Listing/ListingFilters";
import { db } from "@/db";
import { categoriesTable, imagesTable, listingsTable } from "@/db/schema";
import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { ListingCard } from "@/components/Listing/ListingCard";

const Listings = async ({
  searchParams,
}: { searchParams?: { [key: string]: string | undefined } }) => {
  const categories = await db.select().from(categoriesTable);
  if (!searchParams) return;
  const parameters = {
    query: searchParams["query"],
    minPrice: searchParams["min"],
    maxPrice: searchParams["max"],
    category: searchParams["category"],
    condition: searchParams["condition"],
    sort: searchParams["sort"],
    order: searchParams["order"],
  };

  const listings = await db
    .select({
      id: listingsTable.id,
      title: listingsTable.title,
      price: listingsTable.price,
      condition: listingsTable.condition,
      category: categoriesTable.name,
      listedAt: listingsTable.listedAt,
      sellerUsername: listingsTable.sellerUsername,
      images:
        sql`json_agg(json_build_object('id', ${imagesTable.id}, 'url', ${imagesTable.url}, 'position', ${imagesTable.position}))`.as(
          "images",
        ),
    })
    .from(listingsTable)
    .leftJoin(categoriesTable, eq(listingsTable.categoryId, categoriesTable.id))
    .leftJoin(imagesTable, eq(listingsTable.id, imagesTable.listingId))
    .where(
      and(
        parameters.category
          ? eq(listingsTable.categoryId, Number(parameters.category))
          : undefined,
        parameters.minPrice
          ? gte(listingsTable.price, parameters.minPrice)
          : undefined,
        parameters.maxPrice
          ? lte(listingsTable.price, parameters.maxPrice)
          : undefined,
        parameters.condition
          ? eq(listingsTable.condition, parameters.condition)
          : undefined,
        parameters.query
          ? ilike(listingsTable.title, `%${parameters.query}%`)
          : undefined,
      ),
    )
    .groupBy(listingsTable.id, categoriesTable.name)
    .orderBy(desc(listingsTable.listedAt));

  return (
    <div className="p-4">
      <div className="container mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Listings</h1>
        <div className="bg-gray-200 rounded-xl p-5">
          <h3 className="text-xl font-semibold">Filters</h3>
          {searchParams["query"]}
          <ListingFilters categories={categories} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5">
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
      </div>
    </div>
  );
};

export default Listings;
