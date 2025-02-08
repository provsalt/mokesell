"use client";
import { useEffect, useState, useMemo } from "react";
import { ListingCard } from "@/components/Listing/ListingCard";
import { motion } from "motion/react";
import { Book, Gamepad2, Headphones, Shirt } from "lucide-react";
import Link from "next/link";

interface ListingImage {
  id: number;
  url: string;
  position: number;
}

interface Listing {
  id: number;
  title: string;
  price: string;
  condition: string;
  category: string;
  images: ListingImage[];
}

export default function Home() {
  const [data, setData] = useState<Listing[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const filteredItems = useMemo(
    () => data.filter((listing) => listing.category === activeCategory),
    [data, activeCategory],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(data.map((item) => item.category))],
    [data],
  );

  const hardCodedCategories = [
    {
      name: "Books",
      icon: <Book />,
      id: 4,
    },
    {
      name: "Clothing",
      icon: <Shirt />,
      id: 3,
    },
    {
      name: "Electronics",
      icon: <Gamepad2 />,
      id: 1,
    },
    {
      name: "Audio",
      icon: <Headphones />,
      id: 7,
    },
  ];

  useEffect(() => {
    if (!activeCategory) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/listings");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedData = await response.json();

        if (!fetchedData?.data || !Array.isArray(fetchedData.data)) {
          throw new Error("Invalid data format from API");
        }

        setData(fetchedData.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch listings",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0.5 },
    visible: { scale: 1, opacity: 1 },
  };

  if (error) return <div>Error!</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 space-y-12">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Categories</h2>
          {/* Temporary. Redirect to /categories in the future*/}
          <Link href="/listings" className="text-blue-600 text-sm">
            See all categories &gt;
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-8 gap-2 md:gap-6 rounded-2xl">
          {hardCodedCategories.map((cat, i) => (
            <Link
              href={`/listings?category=${cat.id}`}
              key={i}
              className="aspect-square bg-gray-200 rounded-lg flex flex-col justify-center items-center"
            >
              <div className="text-blue-500">{cat.icon}</div>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">For You</h2>
            <Link href={`/listings`} className="text-blue-600 text-sm">
              See all &gt;
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories
              .filter((s, i) => i < 5)
              .map((category, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition ${
                    activeCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {loading
            ? [...Array(10)].map((_, i) => <ListingCard key={i} />)
            : filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <ListingCard
                    id={item.id}
                    name={item.title}
                    price={`$${item.price}`}
                    condition={item.condition}
                    image={item.images.find((i) => i.position === 1)?.url}
                  />
                </motion.div>
              ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">New listings</h2>
          <Link href="/listings?" className="text-blue-600 text-sm">
            See all &gt;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {loading
            ? [...Array(10)].map((_, i) => <ListingCard key={i} />)
            : data.slice(0, 7).map((item) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <ListingCard
                    id={item.id}
                    name={item.title}
                    price={`$${item.price}`}
                    condition={item.condition}
                    image={item.images.find((i) => i.position === 1)?.url}
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
