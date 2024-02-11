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
      <TooltipProvider>
        <h1 className="mb-5 text-center text-3xl font-semibold">Our Fleet</h1>
        <div className="grid grid-cols-4 gap-5">
          {vehicles.map((vehicle) => {
            return (
              <Card className="flex flex-col items-center py-5">
                <CardContent className="">
                  <Image
                    src={vehicle.image}
                    alt="car image"
                    height={200}
                    width={200}
                  />
                  <div className="flex flex-col items-start">
                    <p className="text-lg font-semibold">{vehicle.name}</p>
                    <div className="flex items-center gap-5">
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <div className="flex items-center">
                            <User />
                            <span className="ml-1">{vehicle.seats}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-30 rounded-md bg-secondary p-2 text-center text-black">
                          Passengers
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <div className="flex items-center">
                            <Luggage />
                            <span className="ml-1">{vehicle.luggage}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-30 rounded-md bg-secondary p-2 text-center text-black">
                          Luggage
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Book a trip</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </TooltipProvider>
    </MaxWidthWrapper>
  );
};
export default page;
