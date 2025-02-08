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
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="space-y-2">
        <p>Category</p>
        <Popover
          open={categoryCommandOpen}
          onOpenChange={setCategoryCommandOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryCommandOpen}
              className="w-[200px] justify-between"
            >
              {filters.category
                ? categories.find((cat) => cat.id === filters.category)?.name
                : "All"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
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
        <p>Condition</p>
        <Select
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              condition: value,
            }))
          }
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue
              placeholder="All"
              defaultValue="all"
              defaultChecked={true}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like_new">Like New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="heavily_used">Heavily used</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-2">
          <p>Minimum Price</p>
          <div className="flex items-center gap-1">
            <div className="flex-grow-0 px-4 py-1 bg-gray-50 rounded-lg border shadow-sm">
              $
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minPrice}
              onChange={(change) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: change.target.value,
                }))
              }
              className="w-full bg-white"
            />
          </div>
        </div>{" "}
        <div className="space-y-2">
          <p>Maximum Price</p>
          <div className="flex items-center gap-1">
            <div className="flex-grow-0 px-4 py-1 bg-gray-50 rounded-lg border shadow-sm">
              $
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.maxPrice}
              onChange={(change) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: change.target.value,
                }))
              }
              className="w-full bg-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p>Sort By</p>
        <Select
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              sort: value,
            }))
          }
        >
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue
              placeholder="Date"
              defaultValue="date"
              defaultChecked={true}
            />
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
        <p>Order by</p>
        <RadioGroup
          defaultValue="desc"
          value={filters.order}
          onValueChange={(value) =>
            setFilters((prevState) => ({
              ...prevState,
              order: value as "desc" | "asc" | undefined,
            }))
          }
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
  );
};
