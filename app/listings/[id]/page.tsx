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

  return <div></div>;
};

export default ListingPage;
