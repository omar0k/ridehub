import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL)
    return `https://car-service-blush.vercel.app${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
export function calculatePrice(
  distance: number,
  duration: number,
  costPerMile: number,
  costPerMinute: number,
  baseFare: number,
) {
  const price = baseFare + distance * costPerMile + duration * costPerMinute;
  return price;
}

export const TestTripValues = {
  origin: "200 West Street, New York, NY 10282",
  destination: "95-25 Queens Blvd, Rego Park, NY 11374",
  tripDate: new Date(),
  tripTime: "22:00",
  vehicleId: 1,
};
