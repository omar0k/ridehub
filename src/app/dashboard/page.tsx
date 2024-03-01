"use client";
import { useUser } from "@clerk/nextjs";
// @TODO:
/*
1.show all user trips inside of dashboard 
2.have button to book trip
3.allow user to have their default information such as pick up, drop off

*/
export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  return (
    <>
      <h1>This is the user dashboard</h1>
    </>
  );
}
