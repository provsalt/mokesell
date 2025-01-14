import {z} from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 letters").max(50, "Username cannot be more than 50 letters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be longer than 8 characters")
})
