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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface TripFormProps {
  setDirectionsResponse: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
}

const formSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  scheduleDate: z.string().datetime().min(Date.now()),
  scheduleTime: z.string().datetime(),
});
const TripForm: React.FC<TripFormProps> = ({ setDirectionsResponse }) => {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<Date>();
  const [distance, setDistance] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [directionsError, setDirectionsError] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      origin: "",
      scheduleDate: "",
      scheduleTime: "",
    },
  });
  const { toast } = useToast();
  const { mutate: createTrip } = trpc.createTrip.useMutation({
    onSuccess: () => {
      console.log("success");
    },
  });
  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   console.log(date);
  //   if (
  //     originRef.current?.value !== "" &&
  //     originRef.current?.value !== undefined &&
  //     destinationRef.current?.value !== "" &&
  //     destinationRef.current?.value !== undefined
  //   ) {
  //     const directionService = new google.maps.DirectionsService();
  //     try {
  //       const results = await directionService.route({
  //         origin: originRef.current?.value,
  //         destination: destinationRef.current?.value,
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       });
  //       setDirectionsResponse(results);
  //       setDistance(results.routes[0].legs[0].distance?.text);
  //       setDuration(results.routes[0].legs[0].duration?.text);
  //       setDirectionsError(false);
  //       createTrip({
  //         origin: originRef.current?.value,
  //         destination: destinationRef.current?.value,
  //         status: Status.BOOKED,
  //         scheduledAt: date,
  //       });
  //     } catch (error) {
  //       setDirectionsError(true);
  //       return toast({
  //         title: "Error trying to get directions",
  //         description: "Make sure to select locations from dropdown list",
  //         variant: "destructive",
  //       });
  //     }
  //   }
  // };
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];
  const handleSubmit = () => {};
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-center justify-between gap-5"
      >
        <Card>
          <CardHeader>
            <CardTitle>Get a price</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Autocomplete
                        types={["geocode"]}
                        restrictions={{ country: "us" }}
                      >
                        <Input
                          className={
                            directionsError ? "border-2 border-red-500" : ""
                          }
                          size={30}
                          ref={originRef}
                          placeholder="Enter location"
                          required
                          onChange={() => setDirectionsError(false)}
                        />
                      </Autocomplete>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

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
            {/* <DatePicker date={date} setDate={setDate} /> */}
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
            <Input type="time" required />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-5">
            <Button className="w-full" type="submit">
              See Prices
            </Button>
            <div>
              <p>Distance: {distance}</p>
              <p>Duration: {duration}</p>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
export default TripForm;
