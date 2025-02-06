import { ListingForm } from "@/components/Listing/ListingForm";
import { cookies } from "next/headers";
import { getJWTUser } from "@/lib/auth";

const SellPage = async () => {
  const auth = await getJWTUser(await cookies());
  const categories: { id: number; name: string }[] = (
    await (await fetch("http://localhost:3000/api/categories")).json()
  ).data;

  if (!auth) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ListingForm categories={categories} />
    </div>
  );
};

export default SellPage;
