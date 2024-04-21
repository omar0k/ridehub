import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Map from "@/components/Map";

const page = ({ params }: { params: { vehicleId: string } }) => {
  const { vehicleId } = params;
  return (
    <MaxWidthWrapper>
      <div>
        <Map vehicleId={parseInt(vehicleId)} />
      </div>
    </MaxWidthWrapper>
  );
};
export default page;
