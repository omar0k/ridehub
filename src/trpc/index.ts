// API
import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { tripInfoInput } from "@/types";
import type { Vehicle } from "@prisma/client";
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
  getTrips: privateProcedure.query(async ({ ctx }) => {
    
  }),
});

export type AppRouter = typeof appRouter;
