import { trpc } from "@/app/_trpc/client";
import { CarIcon, Divide, Luggage, User } from "lucide-react";
import { FormField } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormInfoData } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { PersonIcon } from "@radix-ui/react-icons";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { Vehicle } from "@prisma/client";
import VehicleList from "../VehicleList";

interface VehicleSelectionFormProps {
  form: UseFormReturn<FormInfoData>;
  name: string;
  vehicleId?: number;
}
const VehicleSelectionForm: React.FC<VehicleSelectionFormProps> = ({
  vehicleId,
  name,
  form,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data, isLoading } = trpc.getVehicles.useQuery();
  useEffect(() => {
    if (data) {
      setVehicles(data);
    }
  }, [data, isLoading]);

  if (isLoading) {
    return <Skeleton height={40} count={4} />;
  }
  return (
    <>
      <h2 className="mb-1 text-center text-xl font-semibold">
        Select a vehicle
      </h2>
      <FormField
        control={form.control}
        name="vehicleId"
        render={({ field }) => {
          return (
            <div className="max-h-[40dvh] overflow-y-auto py-5">
              <VehicleList vehicleId={vehicleId} form={form} />
            </div>
          );
        }}
      />
    </>
  );
};
export default VehicleSelectionForm;
