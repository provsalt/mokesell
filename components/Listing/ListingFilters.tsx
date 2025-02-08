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
  const [filters, setFilters] = useState<FilterValues>({
    category: Number(searchParams.get("category") ?? undefined),
  });

  useEffect(() => {
    const queryString = new URLSearchParams(searchParams.toString());
    if (filters.category) {
      queryString.set("category", filters.category.toString());
    } else {
      queryString.delete("category");
    }
    if (filters.minPrice)
      queryString.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      queryString.set("maxPrice", filters.maxPrice.toString());
    if (filters.condition)
      queryString.set("category", filters.condition.toString());
    if (filters.sort) queryString.set("sort", filters.sort.toString());
    if (filters.order) queryString.set("order", filters.order.toString());
    router.push("/listings?" + queryString.toString());
  }, [filters, router, searchParams]);

  return (
    <div>
      <div>
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
    </div>
  );
};
