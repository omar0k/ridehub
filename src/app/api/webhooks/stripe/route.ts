import { db } from "@/db";
import { NextApiRequest } from "next";
import { headers } from "next/headers";
import { buffer } from "stream/consumers";
import Stripe from "stripe";
import { tripInfoInput } from "@/types";
import { Status } from "@prisma/client";

export async function POST(request: Request) {
  const body = await request.text();

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
        return createdTrip;
      } catch (error) {}
    }
  }
  return new Response(null, { status: 200 });
}
