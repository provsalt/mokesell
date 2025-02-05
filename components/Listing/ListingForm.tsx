// using client here since the full page requires mostly client side interactions
"use client";

import {createListing, createListingType, selectListingType} from "@/lib/schemas";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

type Props = {
  listing?: selectListingType
}

export const ListingForm = ({listing}: Props) => {
  const defaultValues: createListingType = {
    title: listing?.title || "",
    description: listing?.description || "",
    price: listing?.price || "",
    condition: listing?.condition || "",
    sellerUsername: listing?.sellerUsername || "",
    id: listing?.id || undefined,
    categoryId: listing?.categoryId || undefined,
    deliveryCost: listing?.deliveryCost || undefined,
    status: listing?.deliveryCost || "new",
    listedAt: listing?.listedAt || undefined
  }

  const form = useForm<createListingType>({
    resolver: zodResolver(createListing),
    defaultValues: defaultValues
  })

  const submit = async (values: createListingType) => {
    console.log(values)
  }

  return (
    <div className="flex flex-1">
      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(submit)}>
          <FormField render={({field}) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a nice name for your listing" {...field} />
              </FormControl>
            </FormItem>
          )} name="title" />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}