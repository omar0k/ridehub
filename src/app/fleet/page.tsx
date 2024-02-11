import { useEffect, useState } from "react";
import { trpc } from "../_trpc/client";
import { Vehicle } from "@prisma/client";
import Skeleton from "react-loading-skeleton";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import VehicleList from "@/components/VehicleList";

const Page = () => {
  const { data, isLoading } = trpc.getVehicles.useQuery();
  
  if (isLoading) return <Skeleton count={4} height={100} />;
  return (
    <MaxWidthWrapper className="mt-12">
      <VehicleList />
    </MaxWidthWrapper>
  );
};
export default Page;
