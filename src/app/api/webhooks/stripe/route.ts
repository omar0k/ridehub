import { db } from "@/db";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Status } from "@prisma/client";
import { stripe } from "@/config/stripe";
export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";
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
  const trip = session.metadata;
  if (
    event.type === "checkout.session.completed" ||
    event.type === "invoice.payment_succeeded"
  ) {
    if (trip) {
      try {
        const createdTrip = await db.trip.create({
          data: {
            origin: trip.origin,
            destination: trip.destination,
            duration: parseInt(trip.duration),
            distance: parseInt(trip.distance),
            price: parseFloat(trip.price),
            vehicle: {
              connect: {
                id: parseInt(trip.vehicleId),
              },
            },
            status: Status.BOOKED,
            scheduleDate: trip.scheduleDate,
            scheduleTime: trip.scheduleTime,
          },
        });
        console.log(createdTrip);
        return new Response(JSON.stringify(createdTrip.id), {
          status: 200,
        });
      } catch (error) {
        return new Response("Webhook error", { status: 400 });
      }
    }
  }
  return new Response(null, { status: 200 });
}
