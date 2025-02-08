import { ListingFilters } from "@/components/Listing/ListingFilters";
import { db } from "@/db";
import { categoriesTable, imagesTable, listingsTable } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { ListingCard } from "@/components/Listing/ListingCard";
import { PgColumn } from "drizzle-orm/pg-core";

const Listings = async (props: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) => {
  const categories = await db.select().from(categoriesTable);
  if (!props.searchParams) return;
  const searchParams = await props.searchParams;
  const parameters: {
    query: string | undefined;
    minPrice: string | undefined;
    maxPrice: string | undefined;
    category: string | undefined;
    condition: string | undefined;
    sort: string | undefined;
    order: string | undefined;
  } = {
    query: searchParams["query"],
    minPrice: searchParams["min"],
    maxPrice: searchParams["max"],
    category: searchParams["category"],
    condition: searchParams["condition"],
    sort: searchParams["sort"],
    order: searchParams["order"],
  };

  const columnMapping: Record<string, PgColumn> = {
    query: listingsTable.title,
    price: listingsTable.price,
    condition: listingsTable.condition,
    date: listingsTable.listedAt,
  };

  const sortColumn =
    parameters.sort && columnMapping[parameters.sort ?? "date"]
      ? columnMapping[parameters.sort]
      : listingsTable.listedAt;

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
    .orderBy(parameters.order === "asc" ? asc(sortColumn) : desc(sortColumn));

  return (
    <div className="p-4">
      <div className="container mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Listings</h1>
        <div className="bg-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-xl font-semibold">Filters</h3>
          <ListingFilters categories={categories} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {listings.length > 0 ? (
            listings.map((listing) => {
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
            })
          ) : (
            <div>No listings found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
