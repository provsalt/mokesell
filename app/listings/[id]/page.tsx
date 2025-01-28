import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  condition: string;
  category: string;
  deliveryCost: string;
  status: string;
  listedAt: string;
  seller: Seller;
  images: Image[];
}

interface Seller {
  username: string;
  name: string;
}

interface Image {
  id: number;
  url: string;
  position: number;
}

const ListingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const listing: Listing = (
    await (
      await fetch(`http://localhost:3000/api/listings/${(await params).id}`)
    ).json()
  ).data;

  if (!listing) {
    return <div></div>;
  }

  const avatar = createAvatar(pixelArt, {
    size: 128,
    seed: listing.seller.username,
  }).toDataUri();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-2/3">
          {listing.images && (
            <img
              src={listing.images[0].url}
              className="aspect-video bg-cover"
            />
          )}
        </div>
        <div className="p-8 flex-1 bg-gray-100 dark:bg-gray-900">
          <div className="flex">
            <img className="h-12 w-12" src={avatar} />
            <div className="">
              {listing.seller.name}@{listing.seller.username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
