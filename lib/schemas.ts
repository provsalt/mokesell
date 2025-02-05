import {z} from "zod";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {listingsTable} from "@/db/schema";

// TODO: If we have time refactor to use drizzle schema with zod
export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username cannot be more than 50 characters"),
  name: z.string().max(255, "Name cannot be longer than 255 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be longer than 8 characters")
})

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be longer than 8 characters")
})

export const createListing = createInsertSchema(listingsTable);

export const createListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  condition: z.enum(["new", "like_new", "used", "heavily_used"]),
  categoryId: z.number().int().positive(),
  deliveryCost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  images: z.array(z.instanceof(File)).min(1, {message: "At least one image is required"}).default([]),
});

export const selectListing = createSelectSchema(listingsTable)

export type selectListingType = typeof selectListing._type