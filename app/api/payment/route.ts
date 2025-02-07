import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: Request): Promise<Response> => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "");
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "{{PRICE_ID}}",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/?success=true`,
      cancel_url: `${req.headers.get("origin")}/?canceled=true`,
    });
    redirect(session.url ?? "");
  } catch (err) {
    return NextResponse.json({ error: err });
  }
};
