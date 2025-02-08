"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Category {
  name: string;
  id: number;
}

interface ListingFiltersProps {
  categories: Category[];
}

interface FilterValues {
  category?: number;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const ListingFilters = ({ categories }: ListingFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categoryCommandOpen, setCategoryCommandOpen] = useState(false);
  console.log(searchParams.get("condition"));
  const [filters, setFilters] = useState<FilterValues>({
    category: Number(searchParams.get("category") ?? undefined),
    condition: searchParams.get("condition") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
  });

  useEffect(() => {
    const queryString = new URLSearchParams(searchParams.toString());
    if (filters.category) {
      queryString.set("category", filters.category.toString());
    } else {
      queryString.delete("category");
    }
    if (filters.minPrice) {
      queryString.set("minPrice", filters.minPrice.toString());
    } else {
      queryString.delete("minPrice");
    }
    if (filters.maxPrice) {
      queryString.set("maxPrice", filters.maxPrice.toString());
    } else {
      queryString.delete("maxPrice");
    }
    if (filters.condition)
      queryString.set("condition", filters.condition.toString());
    if (filters.condition === "all") queryString.delete("condition");
    if (filters.sort) queryString.set("sort", filters.sort.toString());
    if (filters.order) queryString.set("order", filters.order.toString());
    router.push("/listings?" + queryString.toString());
  }, [filters, router, searchParams]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Category</p>
        <Popover
          open={categoryCommandOpen}
          onOpenChange={setCategoryCommandOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryCommandOpen}
              className="w-full justify-between"
            >
              {filters.category
                ? categories.find((cat) => cat.id === filters.category)?.name
                : "All"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search categories..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>Category not found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat.id}
                      value={cat.name}
                      onSelect={(currentValue) => {
                        const categorySelected = categories.find(
                          (cat) => cat.name === currentValue,
                        );
                        if (!categorySelected) return;
                        setFilters((prev) => ({
                          ...prev,
                          category:
                            prev.category === categorySelected.id
                              ? undefined
                              : categorySelected.id,
                        }));
                        setCategoryCommandOpen(false);
                      }}
                    >
                      {cat.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          Number(filters.category) === cat.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Condition</p>
        <Select
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              condition: value,
            }))
          }
          value={filters.condition}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like_new">Like New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="heavily_used">Heavily Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <p className="text-sm font-medium">Price Range</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex-grow-0 px-3 py-1 bg-gray-50 rounded-lg border shadow-sm">
              $
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value,
                }))
              }
              className="w-full bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-grow-0 px-3 py-1 bg-gray-50 rounded-lg border shadow-sm">
              $
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value,
                }))
              }
              className="w-full bg-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:col-span-2 lg:col-span-1">
        <div className="space-y-2">
          <p className="text-sm font-medium">Sort By</p>
          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                sort: value,
              }))
            }
            value={filters.sort}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="query">Title</SelectItem>
              <SelectItem value="condition">Condition</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Order</p>
          <RadioGroup
            defaultValue="desc"
            value={filters.order}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                order: value as "desc" | "asc" | undefined,
              }))
            }
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="asc" />
              <Label htmlFor="asc">Ascending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="desc" />
              <Label htmlFor="desc">Descending</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
