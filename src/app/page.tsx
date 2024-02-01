import Navbar from "@/components/Navbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { SignInButton } from "@clerk/nextjs";
import Map from "@/components/Map";

export default async function Home() {
  return (
    <MaxWidthWrapper className="">
      <Navbar />
      <div>
        <Map />
      </div>
    </MaxWidthWrapper>
  );
}
