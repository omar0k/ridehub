import { db } from "@/db";
import Stripe from "stripe";
import { Status } from "@prisma/client";
import { stripe } from "@/config/stripe";
import { sendMail } from "@/lib/sendMail";

export async function POST(request: Request) {
  // Stripe requires the raw body for webhook verification
  const body = await request.text();
  const signature = request.headers.get("Stripe-Signature") ?? "";
  let event: Stripe.Event;

  try {
    // Construct the event using the raw body and Stripe webhook secret
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    console.log(err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
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
      // Update trip status to "BOOKED" in the database
      sendMail({
        subject: "test",
        text: "testing text",
        sendTo: process.env.EMAIL_SEND!,
      });
      await db.trip.update({
        where: {
          id: "52bc93b5-6a44-4108-839a-7ab1f5f8b2f1",
        },
        data: {
          status: Status.BOOKED,
        },
      });
    }
  }

  // Return a success response to Stripe
  return new Response(null, { status: 200 });
}
