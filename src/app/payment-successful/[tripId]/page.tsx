"use client";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const Page = ({ params }: { params: { tripId: string } }) => {
  const { tripId } = params;
  const { data: trip, isLoading } = trpc.getTrip.useQuery(tripId);
  // const session = await stripe.checkout.sessions.retrieve(params);
  if (isLoading) {
    return (
      <MaxWidthWrapper>
        <Skeleton height={100} count={3} />
      </MaxWidthWrapper>
    );
  }
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
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear()}`;
  };
  return (
    <MaxWidthWrapper className="flex items-center justify-center">
      {trip ? (
        <Card className="mx-auto mt-8 w-1/2  p-4 px-12 shadow-xl">
          <CardHeader className="flex items-center border-b pb-2">
            <CheckCircle color="green" size={50} />
            <p className="ml-2 text-xl text-green-800">Payment Complete</p>
          </CardHeader>
          <CardContent className="flex flex-col text-lg">
            <div className="mt-4 flex justify-between ">
              <p className="font-semibold opacity-50">Pick Up:</p>
              <p>{trip.origin}</p>
            </div>
            <div className="mt-4 flex justify-between ">
              <p className="font-semibold opacity-50">Drop Off:</p>
              <p className="">{trip.destination}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-50">Distance:</p>
              <p>{trip.distance} mi.</p>
            </div>
            <div className="mt-4  flex justify-between">
              <p className="font-semibold opacity-50">Duration:</p>
              <p>{trip.duration} min.</p>
            </div>
            <div className="mt-4  flex justify-between">
              <p className="font-semibold opacity-50">Schedule Date:</p>
              <p>{formatDate(trip.scheduleDate ? trip.scheduleDate : "")}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-50">Schedule Time:</p>
              <p>{format(`2000-01-01T${trip.scheduleTime}`, "h:mm a")}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <p className="font-semibold opacity-50">Price:</p>
              <p>${trip.price}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </MaxWidthWrapper>
  );
};
export default Page;
