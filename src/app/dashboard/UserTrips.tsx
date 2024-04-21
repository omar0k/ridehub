"use client";
import Skeleton from "react-loading-skeleton";
import {
  Table,
  TableBody,
  
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {CardContent, CardHeader } from "@/components/ui/card";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";
import { buttonVariants } from "../../components/ui/button";
import {  ArrowRight } from "lucide-react";
import clsx from "clsx";
// @TODO:
/*
1.show all user trips inside of dashboard 
2.have button to book trip
3.allow user to have their default information such as pick up, drop off

*/
const UserTrips = () => {
  const { data: trips, isLoading } = trpc.getTripsByUserId.useQuery();
  if (isLoading) {
    return (
      <div className="rounded-lg px-10">
        <Skeleton className="rounded-lg" count={3} height={100} />
      </div>
    );
  }
  return (
    
    <div className="mx-10  basis-4/5 border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between px-40">
        <p className="flex-grow text-center text-2xl font-semibold">Trips</p>
        <Link
          className={clsx(
            buttonVariants(),
            "group flex items-center justify-center gap-2 ",
          )}
          href={"/"}
        >
          Book Trip
          <ArrowRight className="transition-all duration-300 group-hover:translate-x-2" />
        </Link>
      </CardHeader>

      <CardContent>
        <Table className=" ">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips?.map((trip, idx) => {
              return (
                <TableRow key={trip.id}>
                  <TableCell className="opacity-60">{idx + 1}</TableCell>
                  <TableCell>{trip.origin}</TableCell>
                  <TableCell>{trip.destination}</TableCell>
                  <TableCell>{trip.scheduleDate}</TableCell>
                  <TableCell>{trip.scheduleTime}</TableCell>
                  <TableCell>${trip.price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
};
export default UserTrips;
