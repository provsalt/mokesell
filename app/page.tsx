"use client";
import { useEffect, useState } from "react";
import {ListingCard} from "@/components/Listing/ListingCard";

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
  const [filteredItems, setFilteredItems] = useState<Listing[]>([]);
  const [activeCategory, setActiveCategory] = useState("");

  const categories = [...new Set(data.map(item => item.category))];

  useEffect(() => {
    const storedData = localStorage.getItem('listingsData');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setFilteredItems(parsedData);
    } else {
      fetch("/api/listings")
        .then((response) => response.json())
        .then((fetchedData) => {
          localStorage.setItem('listingsData', JSON.stringify(fetchedData.data));
          setData(fetchedData.data);
          setFilteredItems(fetchedData.data);
        })
        .catch((error) => {
          console.error("Error fetching listings:", error);
        });
    }
  }, []);

  const handleFilter = (category: string) => {
    if (category === activeCategory) {
      setFilteredItems(data);
      setActiveCategory("");
    } else {
      setFilteredItems(data.filter((item) => item.category === category));
      setActiveCategory(category);
    }
  };

  const renderPlaceholderBoxes = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
      ));
      
  return (
    
    <div className="w-full min-h-screen bg-gray-50 p-8 space-y-12">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <a href="#" className="text-blue-600 text-sm">
            See all categories &gt;
          </a>
        </div>
        <div className="grid grid-cols-8 gap-6 rounded-2xl">{renderPlaceholderBoxes(8)}</div>
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
                onClick={() => handleFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id}>
              <ListingCard 
                name={item.title} 
                price={`$${item.price}`} 
                condition={item.condition} 
                images={item.images.map(image=>({
                  url: image.url,
                  position: image.position[0]
                }))} />
            </div>
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
        <div className="grid grid-cols-5 gap-6">
        {data.slice(0, 5).map((item) => (
            <div key={item.id}>
              <ListingCard 
                name={item.title} 
                price={`$${item.price}`} 
                condition={item.condition} 
                images={item.images.map(image => ({
                  url: image.url,
                  position: image.position[0]
                }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}