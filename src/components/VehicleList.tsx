import { trpc } from "@/app/_trpc/client";
import { Vehicle } from "@prisma/client";
import { User, Luggage } from "lucide-react";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { FormInfoData } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
interface VehiclListProps {
  form?: UseFormReturn<FormInfoData>;
  vehicleId?: number;
}
const VehicleList: React.FC<VehiclListProps> = ({ form, vehicleId }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data, isLoading } = trpc.getVehicles.useQuery();
  useEffect(() => {
    if (data) {
      setVehicles(data);
    }
  }, [data, isLoading]);
  const handleVehicleClick = (id: number) => {
    if (form) {
      form.setValue("vehicleId", id);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4 p-5 pb-0 lg:grid-cols-3">
      {isLoading ? (
        <Skeleton height={40} count={4} />
      ) : (
        vehicles?.map((vehicle) => (
          <Card
            className={`${
              (form && form.getValues().vehicleId === vehicle.id) ||
              (!form && vehicleId === vehicle.id)
                ? "border-black"
                : ""
            } ${form ? "cursor-pointer border-4" : ""} flex justify-center`}
            key={vehicle.id}
            onClick={() => handleVehicleClick(vehicle.id)}
          >
            <CardContent>
              <Image
                className="mt-5"
                src={vehicle.image}
                alt="car-image"
                width={form ? 150 : 200}
                height={form ? 150 : 200}
              />
              <TooltipProvider>
                <div
                  className={`${!form ? "gap-2" : ""} flex flex-col items-center`}
                >
                  <p className={`${form ? "" : "text-lg"} font-semibold`}>
                    {vehicle.name}
                  </p>
                  <div className=" flex items-center gap-5">
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="cursor-default"
                      >
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
                      <TooltipTrigger
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="cursor-default"
                      >
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
                  <div>
                    {!form ? (
                      <Link
                        className={buttonVariants({
                          variant: "default",
                        })}
                        href={`/book-trip/${vehicle.id}`}
                      >
                        Book now
                      </Link>
                    ) : null}
                  </div>
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
export default VehicleList;
