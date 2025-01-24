"use client";
import { useState } from "react";

export default function Home() {
  const categories = ["Bikes", "Phones", "Tables", "Plants", "Lego"];

  const allItems = [
    { name: "Item name", price: "$400", condition: "Brand New", category: "Bikes" },
    { name: "Item name", price: "$199", condition: "Lightly Used", category: "Phones" },
    { name: "Item name", price: "$400", condition: "Well Used", category: "Tables" },
    { name: "Item name", price: "$400", condition: "Brand New", category: "Plants" },
    { name: "Item name", price: "$400", condition: "Brand New", category: "Lego" },
  ];

  const nearYouItems = [
    { name: "Item name", price: "$100", condition: "Well Used", category: "Bikes" },
    { name: "Item name", price: "$400", condition: "Lightly Used", category: "Phones" },
    { name: "Item name", price: "$400", condition: "Well Used", category: "Tables" },
    { name: "Item name", price: "$400", condition: "Brand New", category: "Plants" },
    { name: "Item name", price: "$300", condition: "Well Used", category: "Lego" },
  ];

  const [filteredItems, setFilteredItems] = useState(allItems);
  const [activeCategory, setActiveCategory] = useState("");

  const handleFilter = (category: string) => {
    if (category === activeCategory) {
      setFilteredItems(allItems);
      setActiveCategory("");
    } else {
      setFilteredItems(allItems.filter((item) => item.category === category));
      setActiveCategory(category);
    }
  };

  const renderBox = (item: { name: string; price: string; condition: string }) => (
    <div className="space-y-2">
      <div className="aspect-square bg-gray-200 rounded-lg"></div>
      <div className="text-sm space-y-1">
        <p className="text-gray-600">{item.name}</p>
        <p className="font-medium">{item.price}</p>
        <p className="text-gray-500">{item.condition}</p>
      </div>
    </div>
  );

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
          {filteredItems.map((item, i) => (
            <div key={i}>{renderBox(item)}</div>
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
          {nearYouItems.map((item, i) => (
            <div key={i}>{renderBox(item)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}