"use client";
import { useUser } from "@clerk/nextjs";
import { trpc } from "../_trpc/client";
import { useState } from "react";
// @TODO:
/*
1.show all user trips inside of dashboard 
2.have button to book trip
3.allow user to have their default information such as pick up, drop off

*/
export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [trips, setTrips] = useState([]);
  const { data, isLoading } = trpc.getTripsByUserId.useQuery();
  console.log(data);
  return (
    <>
      <div>{data?.map((trip) => <div>{trip.id}</div>)}</div>
      <h1>This is the user dashboard</h1>
    </>
  );
}
