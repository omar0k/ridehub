// API
import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { tripInfoInput } from "@/types";
import type { Trip } from "@prisma/client";
import { stripe } from "@/config/stripe";
import { absoluteUrl } from "@/lib/utils";
import { string, z } from "zod";
export const appRouter = router({
  test: publicProcedure.query(() => {
    return "hello trpc";
  }),
  getVehicles: publicProcedure.query(async () => {
    const vehicles = await db.vehicle.findMany();
    return vehicles;
  }),
  getUser: privateProcedure.query(async (opts) => {
    try {
      return await db.user.findFirst({
        where: {
          id: opts.ctx.userId,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }),
  updateUserDefaultLocations: privateProcedure
    .input(
      z.object({ pickUpLocation: z.string(), dropOffLocation: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId) {
        try {
          const updatedUser = await db.user.update({
            where: {
              id: ctx.userId,
            },
            data: {
              savedPickUpLocation: input.pickUpLocation,
              savedDropOffLocation: input.dropOffLocation,
            },
          });
          return updatedUser;
        } catch (error) {
          console.error("Error updating user: ", error);
          throw error;
        }
      }
    }),
  createTrip: publicProcedure
    .input(tripInfoInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const tripData: any = {
          destination: input.destination,
          origin: input.origin,
          status: input.status,
          scheduleDate: input.scheduleDate,
          price: input.price,
          distance: input.distance,
          duration: input.duration,
          vehicle: {
            connect: {
              id: input.vehicleId,
            },
          },
          scheduleTime: input.scheduleTime,
        };

        if (input.userId) {
          tripData.passenger = {
            connect: {
              id: input.userId,
            },
          };
        }

        const trip = await db.trip.create({ data: tripData });
        return { trip };
      } catch (error) {
        console.error("Error creating trip:", error);
        throw error;
      }
    }),

  getTripsByUserId: privateProcedure.query(async (opts) => {
    const { userId } = opts.ctx;
    return await db.trip.findMany({
      where: {
        userId,
        // Uncomment on production to only retunr booked trips to frontend
        // status:"BOOKED"
      },
    });
  }),
  getTrip: publicProcedure.input(z.string()).query(async (opts) => {
    const trip = db.trip.findFirst({
      where: {
        id: opts.input,
      },
    });
    return trip;
  }),

  createStripeSession: publicProcedure
    .input(
      z.object({
        price: z.number(),
        tripId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const billingUrl = absoluteUrl(
        `/payment-successful/${opts.input.tripId}?sessionId={CHECKOUT_SESSION_ID}`,
      );
      const cancelUrl = absoluteUrl("/");

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: "https://bmoslimo.com",
        cancel_url: cancelUrl,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        line_items: [
          {
            price_data: {
              currency: "USD",
              unit_amount: Math.round(
                opts.input.price ? opts.input.price * 100 : 1,
              ),
              product: "prod_PW5sxIbW33VAhP",
            },
            quantity: 1,
          },
        ],
        metadata: {
          tripId: opts.input.tripId,
        },
      });

      return {
        url: stripeSession.url,
        trip: stripeSession.metadata,
        stripeSessionId: stripeSession.id,
      };
    }),
});

export type AppRouter = typeof appRouter;
