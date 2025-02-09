import Stripe from "stripe";
import { z } from "zod";
import { getJWTUser } from "@/lib/auth";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Create a PaymentIntent
 *     description: Create a Stripe PaymentIntent with the provided amount and currency.
 *     tags: [Payment]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount in dollars (will be multiplied by 100).
 *                 example: 10
 *               currency:
 *                 type: string
 *                 description: The currency code.
 *                 example: "sgd"
 *     responses:
 *       200:
 *         description: PaymentIntent created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                   description: The client secret of the PaymentIntent.
 *                   example: "pi_1GqIC8..."
 *       400:
 *         description: Bad Request. Invalid or missing parameters.
 *       500:
 *         description: Internal Server Error.
 */

const createPaymentIntentSchema = z.object({
  amount: z
    .number()
    .positive({ message: "Amount must be a positive number" })
    .min(0.5, {
      message: "Stripe requires amount to be greater than 50 cents",
    }),
  currency: z.string().optional().default("sgd"),
});

export const POST = async (request: Request) => {
  const user = await getJWTUser(await cookies());
  if (!user) return new Response(null, { status: 403 });
  try {
    const json = await request.json();
    const result = createPaymentIntentSchema.safeParse(json);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.format() }), {
        status: 400,
      });
    }

    const { amount, currency } = result.data;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert dollars to cents
      currency,
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
