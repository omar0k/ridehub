import { trpc } from "@/app/_trpc/client";

const VehicleList = () => {
  const { data: vehicles } = trpc.getVehicles.useQuery();
  console.log(vehicles);
  return <div></div>;
};
export default VehicleList;
