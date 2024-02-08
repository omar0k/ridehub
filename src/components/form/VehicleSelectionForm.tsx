import { trpc } from "@/app/_trpc/client";
import { CarIcon, Divide, Luggage, User } from "lucide-react";
import { FormField } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormInfoData } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { PersonIcon } from "@radix-ui/react-icons";
import Skeleton from "react-loading-skeleton";

interface VehicleSelectionFormProps {
  form: UseFormReturn<FormInfoData>;
  name: string;
}
const VehicleSelectionForm: React.FC<VehicleSelectionFormProps> = ({
  name,
  form,
}) => {
  const { data: vehicles, isLoading } = trpc.getVehicles.useQuery();
  console.log(vehicles);
  return (
    <>
      <h2 className="mb-1 text-center font-semibold">Select a vehicle</h2>
      <FormField
        control={form.control}
        name="vehicleId"
        render={({ field }) => {
          return (
            <div className="max-h-[50dvh] overflow-y-auto py-5">
              <div className="grid grid-cols-2 gap-5 p-5 md:grid-cols-3">
                {isLoading ? (
                  <Skeleton height={40} count={4} />
                ) : (
                  vehicles?.map((vehicle) => (
                    <Card
                      className={`cursor-pointer border-4 ${form.getValues().vehicleId === vehicle.id ? "border-black" : ""}`}
                      key={vehicle.id}
                      onClick={() => {
                        form.setValue("vehicleId", vehicle.id);
                        console.log(form.getValues());
                      }}
                    >
                      <CardContent>
                        <Image
                          className="mt-5"
                          src={vehicle.image}
                          alt="car-image"
                          width={150}
                          height={150}
                        />
                        <div className="flex-col">
                          <p className="font-semibold capitalize">
                            {vehicle.name}
                          </p>
                          <div className="flex gap-1">
                            <User /> {vehicle.seats}
                          </div>
                          <div className="flex gap-1">
                            <Luggage /> {vehicle.luggage}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        }}
      />
    </>
  );
};
export default VehicleSelectionForm;
