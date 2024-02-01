"use client";

import { Autocomplete } from "@react-google-maps/api";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { Status } from "@prisma/client";

import { Label } from "./ui/label";

interface TripFormProps {
  setDirectionsResponse: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
}
const TripForm: React.FC<TripFormProps> = ({ setDirectionsResponse }) => {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState<string>("00:00");
  const [distance, setDistance] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [directionsError, setDirectionsError] = useState<boolean>(false);

  const { toast } = useToast();
  const { mutate: createTrip } = trpc.createTrip.useMutation({
    onSuccess: () => {
      console.log("success");
    },
  });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(date);
    if (
      originRef.current?.value !== "" &&
      originRef.current?.value !== undefined &&
      destinationRef.current?.value !== "" &&
      destinationRef.current?.value !== undefined
    ) {
      const directionService = new google.maps.DirectionsService();
      try {
        const results = await directionService.route({
          origin: originRef.current?.value,
          destination: destinationRef.current?.value,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance?.text);
        setDuration(results.routes[0].legs[0].duration?.text);
        setDirectionsError(false);
        console.log(scheduleTime);
        if (distance && duration) {
          createTrip({
            destination: destinationRef.current?.value,
            origin: originRef.current?.value,
            status: Status.BOOKED,
            distance: parseFloat(distance?.replace(/[^\d.]/g, "")),
            duration: parseInt(duration?.replace(/[^\d.]/g, "")),
            price:
              parseFloat(distance?.replace(/[^\d.]/g, "")) +
              parseInt(duration?.replace(/[^\d.]/g, "")),
            scheduleDate: date?.toISOString(),
            scheduleTime: scheduleTime,
            vehicleId: 1,
          });
        }
      } catch (error) {
        setDirectionsError(true);
        return toast({
          title: "Error trying to get directions",
          description: "Make sure to select locations from dropdown list",
          variant: "destructive",
        });
      }
    }
  };
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-between gap-5"
    >
      <Card>
        <CardHeader>
          <CardTitle>Get a price</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <Label>From</Label>
            <Autocomplete types={["geocode"]} restrictions={{ country: "us" }}>
              <Input
                className={directionsError ? "border-2 border-red-500" : ""}
                size={30}
                ref={originRef}
                placeholder="Enter location"
                required
                onChange={() => setDirectionsError(false)}
              />
            </Autocomplete>
          </div>

          <div>
            <Label>To</Label>
            <Autocomplete restrictions={{ country: "us" }}>
              <Input
                className={directionsError ? "border-2 border-red-500" : ""}
                required
                size={30}
                onChange={() => setDirectionsError(false)}
                ref={destinationRef}
                placeholder="Enter destination"
              />
            </Autocomplete>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              required
              min={currentDateString}
              onChange={(e) => {
                const parsedDate = new Date(e.target.value);
                setDate(parsedDate);
              }}
              value={date ? date.toISOString().split("T")[0] : ""}
            />
          </div>

          <div>
            <Label>Time</Label>
            <Input
              value={scheduleTime}
              onChange={(e) => {
                setScheduleTime(e.target.value);
                console.log(scheduleTime);
              }}
              type="time"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-5">
          <Button className="w-full" type="submit">
            Book Trip
          </Button>
          <div>
            <p>
              {distance ? "Distance:" : ""} {distance}
            </p>
            <p>
              {duration ? "Duration: " : ""}
              {duration}
            </p>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
export default TripForm;
