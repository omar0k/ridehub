"use client";
import { trpc } from "../_trpc/client";
import { Vehicle } from "@prisma/client";
import Skeleton from "react-loading-skeleton";


import VehicleList from "@/components/VehicleList";
import React from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Page = () => {
  const { data, isLoading } = trpc.getVehicles.useQuery();

  if (isLoading) return <Skeleton count={4} height={100} />;
  return (
    <MaxWidthWrapper className="mt-10">
      <h1 className="text-center text-3xl font-bold">Our Fleet</h1>
      <VehicleList />
    </MaxWidthWrapper>
  );
};
export default Page;
