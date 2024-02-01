// API
import { db } from "@/db";
import { publicProcedure, router } from "./trpc";
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
      const trip = await db.trip.create({
        data: {
          destination: "Dummy Destination",
          origin: "Dummy Origin",
          status: "CANCELLED", // Assuming "Scheduled" is a valid status enum value
          startTime: new Date().toISOString(), // Current time
          endTime: new Date().toISOString(), // Current time
          scheduledAt: new Date().toISOString(), // Current time
          rating: 5, // A dummy rating value
          price: 49.99, // A dummy price value
          vehicleId: 1, // Assuming 1 is a valid vehicle ID
          userId: "dummyUser123", // Assuming "dummyUser123" is a
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
