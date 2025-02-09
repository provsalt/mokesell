import { ListingForm } from "@/components/Listing/ListingForm";
import { cookies } from "next/headers";
import { getJWTUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { location } from "@/lib/utils";

const SellPage = async () => {
  const auth = await getJWTUser(await cookies());
  const categories: { id: number; name: string }[] = (
    await (await fetch(`${location}/api/categories`)).json()
  ).data;
  if (!auth) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <ListingForm categories={categories} />
    </div>
  );
};

export default SellPage;
