"use client";
import { useEffect, useState, useMemo } from "react";
import { ListingCard } from "@/components/Listing/ListingCard";
import { motion } from "motion/react";

interface ListingImage {
  id: number;
  url: string;
  position: number[];
}

interface Listing {
  id: number;
  title: string;
  price: string;
  condition: string;
  category: string;
  listable: string;
  solicitorsname: string;
  images: ListingImage[];
}

export default function Home() {
  const [data, setData] = useState<Listing[]>([]);
  const [activeCategory, setActiveCategory] = useState("Electronics");
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
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const renderPlaceholderBoxes = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
      ));

  if (error) return <div>Error!</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8 space-y-12">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <a href="#" className="text-blue-600 text-sm">
            See all categories &gt;
          </a>
        </div>
        <div className="grid grid-cols-8 gap-6 rounded-2xl">
          {renderPlaceholderBoxes(8)}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">For You</h2>
            <a href="#" className="text-blue-600 text-sm">
              See all &gt;
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {loading
            ? [...Array(10)].map((_, i) => <ListingCard key={i} />)
            : filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <ListingCard
                    name={item.title}
                    price={`$${item.price}`}
                    condition={item.condition}
                    images={item.images}
                  />
                </motion.div>
              ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Near You</h2>
          <a href="#" className="text-blue-600 text-sm">
            See all &gt;
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {loading
            ? [...Array(10)].map((_, i) => <ListingCard key={i} />)
            : data.slice(0, 5).map((item) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <ListingCard
                    name={item.title}
                    price={`$${item.price}`}
                    condition={item.condition}
                    images={item.images}
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
