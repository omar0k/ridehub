import { db } from "@/db";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  console.log("hello", body);
  const signature = headers().get("Stripe-Signature") ?? "";
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 400 },
    );
  }


  if (event.type === "checkout.session.completed") {
    const { trip } = JSON.parse(body);
    console.log("Checkout completed", trip);
  }
  return new Response(null, { status: 200 });
}
