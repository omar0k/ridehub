import Navbar from "@/components/Navbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { SignInButton } from "@clerk/nextjs";
import Map from "@/components/Map";
import ToFromLocations from "@/components/ToFromLocations";

export default async function Home() {
  return (
    <MaxWidthWrapper className="">
      <Navbar />
      <div>
        <ToFromLocations />
        <Map />
      </div>
    </MaxWidthWrapper>
  );
}
