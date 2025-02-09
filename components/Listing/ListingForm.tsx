// using client here since the full form requires mostly client side interactions
"use client";
import { createListingSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

const formSchema = createListingSchema.extend({
  categoryId: z.number().int().min(1, { message: "Invalid category" }),
});

type Props = {
  listing?: z.infer<typeof formSchema>;
  categories: Category[];
};

export const ListingForm = ({ listing, categories }: Props) => {
  const defaultValues: z.infer<typeof formSchema> = {
    title: listing?.title || "",
    description: listing?.description || "",
    price: listing?.price || "",
    condition: listing?.condition || "new",
    categoryId: listing?.categoryId || 0,
    deliveryCost: listing?.deliveryCost || undefined,
    images: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const [previews, setPreviews] = useState<string[]>([]);

  const { push } = useRouter();

  const { toast } = useToast();

  const submit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("condition", values.condition);
    if (values.categoryId && values.categoryId > 0) {
      formData.append("categoryId", String(values.categoryId));
    }
    if (values.deliveryCost !== undefined) {
      formData.append("deliveryCost", String(values.deliveryCost));
    }

    if (values.images && values.images.length > 0) {
      values.images.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        toast({
          variant: "destructive",
          title: "Failed to create listing",
          description:
            errorData.error?.toString() ||
            "Something went wrong. Please try again later.",
        });
      }

      const data: { id: number } = (await response.json()).data;
      console.log("Listing saved:", data);
      toast({
        title: "Listing created successfully!",
        description:
          "Your listing has been saved. Redirecting you to your listing page.",
      });
      await new Promise((r) => setTimeout(r, 2000));
      push(`/listings/${data.id}`);
    } catch (error) {
      console.error("Error posting listing:", error);
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error Occurred",
          description: error.message ?? "Unexpected error.",
        });
      }
    }
  };

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div className="flex flex-1">
      <Form {...form}>
        <form
          className="flex flex-1 flex-col gap-4"
          autoComplete="off"
          onSubmit={form.handleSubmit(submit)}
        >
          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a nice name for your listing"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="title"
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      field.onChange(files);
                      const urls = files.map((file) =>
                        URL.createObjectURL(file),
                      );
                      setPreviews(urls);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {previews.map((preview, index) => (
                <div key={index} className="w-20 h-20 relative">
                  <Image
                    src={preview}
                    fill
                    alt={`Preview ${index}`}
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your item in detail"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row w-full gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <div className="flex-grow-0 px-4 py-1 bg-gray-50 rounded-lg border shadow-sm">
                        $
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryCost"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Delivery Cost</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <div className="flex-grow-0 px-4 py-1 bg-gray-50 rounded-lg border shadow-sm">
                        $
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row w-full gap-4">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the item's condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like new</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="heavily_used">Heavily used</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel>Category</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          ref={triggerRef}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? categories.find((cat) => cat.id === field.value)
                                ?.name
                            : "Select Category"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-full p-0"
                      style={{ width: width ? width : undefined }}
                    >
                      <Command>
                        <CommandInput
                          placeholder="Search category..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                value={category.name}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", category.id);
                                }}
                              >
                                {category.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    category.id === field.value
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
