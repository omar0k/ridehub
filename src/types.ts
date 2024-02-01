import { z } from "zod";
import type { User } from "@prisma/client";
import { Status } from "@prisma/client";
import type { Trip } from "@prisma/client";
import type { Vehicle } from "@prisma/client";

export const tripInfoInput = z.object({
  origin: z.string({ required_error: "Enter origin location" }).min(1),
  destination: z
    .string({ required_error: "Enter destination location" })
    .min(1),
  status: z.nativeEnum(Status).optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  scheduledAt: z.date().optional(),
  rating: z.number().min(1).max(5).optional(),
  price: z.number().min(1).optional(),
  userId: z.string().optional(),
  vehicleId: z.number().optional(),
});

export const vehicleSchema = z.object({
  id: z.number(),
  owner: z.string().min(1),
  plate: z.number().min(1).max(12),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number(),
  seats: z.number(),
  luggage: z.number(),
  image: z.string(),
  trip: tripInfoInput,
});