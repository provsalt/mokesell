import {z} from "zod";

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
