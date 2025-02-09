import Stripe from "stripe";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (req: Request) => {
  const user = await getJWTUser(await cookies());
  if (!user) return new Response(null, { status: 403 });

  const requestText = await req.text();
  const sig = req.headers.get("stripe-signature");
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  if (!sig) {
    console.error("Stripe signature is null");
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(requestText, sig, signingSecret);

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      db.update(usersTable)
        .set({
          balance: sql`${usersTable.balance} + ${paymentIntent.amount / 100}`,
        })
        .where(eq(usersTable.username, user.username));
      revalidatePath("/", "layout");
      break;
    default:
      console.log(event);
  }

  NextResponse.json({ received: true });
};
