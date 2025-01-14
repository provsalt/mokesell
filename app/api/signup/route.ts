import {z} from "zod";
import {signUpSchema} from "@/lib/schemas";

export const POST = async (request: Request) => {
  const req: z.infer<typeof signUpSchema> = await request.json();
  const error = (body: string | null) => {
    new Response(body, {
      status: 422
    })
  }
  if (!signUpSchema.safeParse(req).success) {
    return error;
  }

  

  console.log(req)

  return new Response()
}