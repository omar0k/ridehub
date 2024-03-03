"use client";
import UserTrips from "@/components/UserTrips";
// @TODO:
/*
1.show all user trips inside of dashboard DONE
2.have button to book trip
3.allow user to have their default information such as pick up, drop off

*/
export default function Dashboard() {
  return (
    <div>
      {/* <LeftSideMenu */}
      {/* 
        Saved preferences 
      */}
      <UserTrips />
    </div>
  );
}
