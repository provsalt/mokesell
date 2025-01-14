import {z} from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username cannot be more than 50 characters"),
  name: z.string().max(255, "Name cannot be longer than 255 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be longer than 8 characters")
})
