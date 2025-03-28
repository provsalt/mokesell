import Image from "next/image";
import {ListingImage} from "@/components/Listing/ListingImage";
import ListingMessage from "@/components/Listing/ListingMessage";
import {Truck} from "lucide-react";
import {location} from "@/lib/utils";
import {formatDistance} from "date-fns";
import Link from "next/link";
import {Avatar} from "@/components/Avatar/Avatar";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  deliveryCost?: string;
  status: string;
  listedAt: string;
  seller: Seller;
  images: Image[];
}

interface Seller {
  username: string;
  name: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

interface Review {
  rating: number;
  comment: string;
  date: string;
}

interface Image {
  id: number;
  url: string;
  position: number;
}

const ListingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const listing: Listing = (
    await (
      await fetch(`${location}/api/listings/${(await params).id}`)
    ).json()
  ).data;

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 space-y-4">
          <ListingImage images={listing.images}/>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">{listing.title}</h1>
            </div>
            <p className="text-2xl font-bold">${listing.price}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck />
              {listing.deliveryCost ? <span>${listing.deliveryCost}</span> : "Free"}
              <span>Same day delivery</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Condition</p>
                  <p className="capitalize">{listing.condition.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p>{listing.category}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link href={`/users/${listing.seller.username}`}>
                <Avatar username={listing.seller.username} size={64}/>
              </Link>
              <div>
                <div className="flex gap-0.5 flex-col">
                  <p className="font-semibold">{listing.seller.name}</p>
                  <p>Posted {formatDistance(Date.now(), listing.listedAt)} ago</p>
                  {listing.seller.rating && (
                    <span className="text-gray-600">
                      {listing.seller.rating} ★ ({listing.seller.reviewCount})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ListingMessage
              listingId={listing.id}
              sellerUsername={listing.seller.username}
              initialOffer={listing.price}
            />

            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-semibold">Returns and refunds</h3>
                <p className="text-sm text-gray-600">
                  Depends on the seller&#39;s decision. Not covered by Buyer
                  Protection.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Safety policy</h3>
                <p className="text-sm text-gray-600">
                  Pay only at the meet-up. Transferring money directly to
                  strangers puts you at risk of e-commerce scams.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {listing.seller.reviews && (
                <h3 className="font-semibold">Reviews</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
