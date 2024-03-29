import { z } from "zod";
import { Status } from "@prisma/client";

export const tripInfoInput = z.object({
  userId: z.string().optional(),
  origin: z.string({ required_error: "Enter origin location" }).min(1),
  destination: z
    .string({ required_error: "Enter destination location" })
    .min(1),
  status: z.nativeEnum(Status).optional(),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  price: z.number().min(1).optional(),
  duration: z.number(),
  distance: z.number(),
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

export interface FormInfoData {
  origin: string;
  destination: string;
  tripDate: Date;
  tripTime: string;
  vehicleId: number;
}
export interface DefaultLocationsFormData {
  origin: string;
  destination: string;
}
