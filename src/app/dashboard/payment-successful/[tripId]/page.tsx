"use client";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { stripe } from "@/config/stripe";
import { CheckCircle } from "lucide-react";

const Page = ({ params }: { params: { tripId: string } }) => {
  const { tripId } = params;
  const { data: trip } = trpc.getTrip.useQuery(tripId);
  // const session = await stripe.checkout.sessions.retrieve(params);
  if (!tripId || !trip) {
    return (
      <MaxWidthWrapper className="flex items-center justify-center">
        <Card>
          <CardHeader>404 Page Not Found</CardHeader>
          <CardContent>Invalid URL - No ID found</CardContent>
        </Card>
      </MaxWidthWrapper>
    );
  }
  return (
    <MaxWidthWrapper className="flex items-center justify-center">
      {trip ? (
        <Card className="mx-auto mt-8 w-1/2  p-4 px-12 shadow-xl">
          <CardHeader className="flex items-center border-b pb-2">
            <CheckCircle color="green" size={50} />
            <p className="ml-2 text-xl text-green-800">Payment Complete</p>
          </CardHeader>
          <CardContent className="flex flex-col text-lg">
            <div className="mt-4  flex justify-between ">
              <p className="font-semibold opacity-70">Origin:</p>
              <p>{trip.origin}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-70">Destination:</p>
              <p>{trip.destination}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-70">Distance:</p>
              <p>{trip.distance} mi.</p>
            </div>
            <div className="mt-4  flex justify-between">
              <p className="font-semibold opacity-70">Duration:</p>
              <p>{trip.duration} min.</p>
            </div>
            <div className="mt-4  flex justify-between">
              <p className="font-semibold opacity-70">Schedule Date:</p>
              <p>{trip.scheduleDate}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-70">Schedule Time:</p>
              <p>{trip.scheduleTime}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-70">Price:</p>
              <p>${trip.price}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </MaxWidthWrapper>
  );
};
export default Page;
