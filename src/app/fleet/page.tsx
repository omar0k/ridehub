"use client";
import { useEffect, useState } from "react";
import { trpc } from "../_trpc/client";
import { Vehicle } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { HelpCircle, Luggage, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import VehicleList from "@/components/VehicleList";

const page = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data, isLoading } = trpc.getVehicles.useQuery();
  useEffect(() => {
    if (data) {
      setVehicles(data);
    }
  }, [data, isLoading]);
  if (isLoading) return <Skeleton count={4} height={100} />;
  return (
    <MaxWidthWrapper className="mt-12">
      <VehicleList />
    </MaxWidthWrapper>
  );
};
export default page;
