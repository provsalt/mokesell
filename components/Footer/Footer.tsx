import Logo from "@/public/mokesell.png";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto py-10 px-2">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex flex-col md:flex-row flex-1 items-center">
            <Image src={Logo} alt="Mokesell Logo" width={192} height={192} />
            <div>
              <h1 className="text-2xl font-bold">Mokesell</h1>
              <p>
                At Mokesell, we make buying and selling a breeze. Discover
                unique finds, connect with a vibrant community, and seize every
                opportunity with ease.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-1 gap-4 justify-between px-0 md:px-4">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Shop</h2>
              <div className="flex flex-col gap-2">
                <Link className="text-lg font-medium" href="/about">
                  About Us
                </Link>
                <Link className="text-lg font-medium" href="/careers">
                  Careers
                </Link>
                <Link className="text-lg font-medium" href="/news">
                  News
                </Link>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Sell</h2>
              <div className="flex flex-col gap-2">
                <Link className="text-lg font-medium" href="/sell">
                  Sell
                </Link>
                <Link className="text-lg font-medium" href="/profile">
                  Profile
                </Link>
                {/*not implemented*/}
                <Link className="text-lg font-medium" href="/guide/seller">
                  Seller&#39;s Guide
                </Link>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Shop</h2>
              <div className="flex flex-col gap-2">
                <Link className="text-lg font-medium" href="/listings">
                  Latest
                </Link>
                <Link className="text-lg font-medium" href="/categories">
                  Categories
                </Link>
                {/*lowest price filter*/}
                <Link className="text-lg font-medium" href="/listings?">
                  Deals
                </Link>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Support & Community</h2>
              <div className="flex flex-col gap-2">
                <Link className="text-lg font-medium" href="/about">
                  Help Center
                </Link>
                <Link className="text-lg font-medium" href="/news">
                  Contact Us
                </Link>
                <Link className="text-lg font-medium" href="/careers">
                  Seller & Buyer Guidelines
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="container mx-auto p-2">
          <div className="inline-flex text-xs gap-3 text-muted-foreground">
            <p>Copyright © 2025 Mokesell</p>
            <p>Mokesell is a registered business in Singapore</p>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
