import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {ListingImage} from "@/components/Listing/ListingImage";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
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
      await fetch(`http://localhost:3000/api/listings/${(await params).id}`)
    ).json()
  ).data;

  if (!listing) {
    return <div>Loading...</div>;
  }

  const avatar = createAvatar(pixelArt, {
    size: 48,
    seed: listing.seller.username,
  }).toDataUri();

  return (
    <div className="md:container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow space-y-4">
          <ListingImage images={listing.images}/>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">{listing.title}</h1>
            </div>
            <p className="text-2xl font-bold">${listing.price}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>${listing.deliveryCost}</span>
              <span>Same day delivery</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Condition</p>
                  <p>{listing.condition.split(' ').map(i => i[0].toUpperCase() + i.substring(1).toLowerCase()).join(' ')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p>{listing.category}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">Description</h2>
              <p className="text-gray-600">{listing.description}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={avatar}
                width={64}
                height={64}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{listing.seller.name}</span>
                  {listing.seller.rating && (
                    <span className="text-gray-600">
                      {listing.seller.rating} ★ ({listing.seller.reviewCount})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button className="w-full">Message</Button>

            <div className="flex gap-2">
              <Input
                type="number"
                defaultValue={listing.price}
                className="flex-1"
              />
              <Button className="bg-blue-500">Make Offer</Button>
            </div>

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
              {listing.seller.reviews &&
                listing.seller.reviews.map((review, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {/*TODO: calculate image with dicebear*/}
                      {/*<img alt="" className="w-8 h-8 rounded-full" />*/}
                      <div>
                        <p className="font-semibold">{listing.seller.name}</p>
                        <div className="flex items-center gap-1">
                          <span>{"★".repeat(review.rating)}</span>
                          <span className="text-gray-600">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
