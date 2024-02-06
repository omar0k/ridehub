import { trpc } from "@/app/_trpc/client";
import { CarIcon, Divide } from "lucide-react";
import { FormField } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormInfoData } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";

interface VehicleSelectionFormProps {
  form: UseFormReturn<FormInfoData>;
}
const VehicleSelectionForm: React.FC<VehicleSelectionFormProps> = ({
  form,
}) => {
  const { data: vehicles } = trpc.getVehicles.useQuery();
  console.log(vehicles);
  return (
    <>
      <h2 className="mb-1 text-center font-semibold">Select a vehicle</h2>
      <FormField
        control={form.control}
        name="vehicleId"
        render={({ field }) => {
          return (
            <div className="max-h-[400px] overflow-y-auto py-5">
              <div className="grid grid-cols-3 gap-5">
                {vehicles?.map((vehicle) => (
                  <Card
                    className={`cursor-pointer  ${form.getValues().vehicleId === vehicle.id ? "border-4  border-black" : ""}`}
                    key={vehicle.id}
                    onClick={() => {
                      form.setValue("vehicleId", vehicle.id);
                      console.log(form.getValues());
                    }}
                  >
                    <CardContent>
                      <Image
                        className="mt-5 "
                        src={vehicle.image}
                        alt="car-image"
                        width={150}
                        height={150}
                      />
                      <div className="flex-col ">
                        <p className="font-semibold capitalize">
                          {vehicle.name}
                        </p>
                        <p>Seats: {vehicle.seats}</p>
                        <p>Luggage: {vehicle.luggage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        }}
      />
    </>
  );
};
export default VehicleSelectionForm;
