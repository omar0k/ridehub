// API
import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { tripInfoInput } from "@/types";
import type { Vehicle } from "@prisma/client";
import { stripe } from "@/config/stripe";
import { absoluteUrl } from "@/lib/utils";
import { z } from "zod";
export const appRouter = router({
  test: publicProcedure.query(() => {
    return "hello trpc";
  }),
  getVehicles: publicProcedure.query(async () => {
    const vehicles = await db.vehicle.findMany();
    return vehicles;
  }),
  createTrip: publicProcedure
    .input(tripInfoInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const trip = await db.trip.create({
          data: {
            destination: input.destination,
            origin: input.origin,
            status: input.status,
            scheduleDate: input.scheduleDate,
            price: input.price,
            distance: input.distance,
            duration: input.duration,
            vehicle: {
              connect: {
                id: 1,
              },
            },
            scheduleTime: input.scheduleTime,
          },
        });
        return trip;
      } catch (error) {
        console.error("Error creating trip:", error);

        throw error;
      }
    }),
  getTrips: privateProcedure.query(async () => {}),
  createStripeSession: publicProcedure
    .input(z.object({ price: z.number() }))
    .mutation(async (opts) => {
      const billingUrl = absoluteUrl("/dashboard/billing");
      console.log(opts.input.price);
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        line_items: [
          {
            price_data: {
              currency: "USD",
              unit_amount: opts.input.price * 100,
              product: "prod_PW5sxIbW33VAhP",
            },
            quantity: 1,
          },
        ],
      });
      return { url: stripeSession.url, price: opts.input.price };
    }),
});

export type AppRouter = typeof appRouter;
