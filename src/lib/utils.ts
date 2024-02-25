import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://car-service-blush.vercel.app${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
export function calculatePrice(distance: number, duration: number) {
  return distance * duration;
}

export const TestTripValues = {
  origin: "200 West Street, New York, NY 10282",
  destination: "633 3rd Ave, New York, NY 10016",
  tripDate: new Date().toISOString().split("T")[0],
  tripTime: "12:00",
  vehicleId: 1,
};
