import { db } from "@/db";
import Stripe from "stripe";
import { Status } from "@prisma/client";
import { stripe } from "@/config/stripe";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("Stripe-Signature") ?? "";  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error Test: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata;
  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.payment_succeeded"
  ) {
    if (metadata) {
      db.trip.update({
        where: {
          id: metadata.tripId,
        },
        data: {
          status: Status.BOOKED,
        },
      });
    }
  }
  return new Response(null, { status: 200 });
}
