"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
const DefaultLocationsForm = () => {
  const { data: user } = trpc.getUser.useQuery();
  return (
    <div className="flex h-full  flex-grow-0 flex-col">
      <CardHeader className="flex items-center justify-center">
        <h3 className="text-2xl font-semibold">Default Locations</h3>
      </CardHeader>
      <CardContent className="w-1/2">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Enter default pick-up location"
              className="w-1/2"
            />
            <Input
              type="text"
              placeholder="Enter default drop-off location"
              className="w-1/2"
            />
            <div className="flex items-center">
              <Button size={"lg"}>Save</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
export default DefaultLocationsForm;
