import { trpc } from "@/app/_trpc/client";
import { CarIcon, Divide } from "lucide-react";
import { FormField } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormInfoData } from "@/types";

interface VehicleSelectionFormProps {
  form: UseFormReturn<FormInfoData>;
}
const VehicleSelectionForm: React.FC<VehicleSelectionFormProps> = ({
  form,
}) => {
  const { data: vehicles } = trpc.getVehicles.useQuery();
  return (
    <FormField
      control={form.control}
      name="vehicleId"
      render={({ field }) => {
        return (
          <div>
            {vehicles?.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => {
                  form.setValue("vehicleId", vehicle.id);
                  console.log(form.getValues());
                }}
              >
                {" "}
                <CarIcon />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};
export default VehicleSelectionForm;
