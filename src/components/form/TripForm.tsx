import { TypeOf, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { isValid } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Status } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "../ui/use-toast";
import { useMultistepForm } from "@/app/hooks/useMutlistepForm";
import TripDetailsForm from "./TripDetailsForm";
import VehicleSelectionForm from "./VehicleSelectionForm";
import { ArrowLeft } from "lucide-react";

export const formSchema = z.object({
  origin: z
    .string()
    .min(1, { message: "Please enter a valid pick up location" }),
  destination: z
    .string()
    .min(1, { message: "Please enter a valid drop off location" }),
  tripDate: z.string().refine(
    (value) => {
      const isValidDate = isValid(new Date(value));
      return isValidDate;
    },
    { message: "Please enter a valid date" },
  ),
  tripTime: z.string().min(1, { message: "Please enter a trip time" }),
  vehicleId: z.number(),
});
interface TripFormProps {
  setDirectionsResponse: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
}
const SecondTripForm: React.FC<TripFormProps> = ({ setDirectionsResponse }) => {
  const [distance, setDistance] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [directionsError, setDirectionsError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      tripDate: "",
      tripTime: "",
      vehicleId: 0,
    },
  });
  const {
    steps,
    currentStepIndex,
    step: formStep,
    next,
    back,
    goTo,
    isFirstStep,
    isLastStep,
  } = useMultistepForm([
    <TripDetailsForm
      form={form}
      directionsError={directionsError}
      setDirectionsError={setDirectionsError}
    />,
    <VehicleSelectionForm form={form} />,
  ]);
  const { mutate: createTrip } = trpc.createTrip.useMutation();
  const { toast } = useToast();
  const handleSubmit = async (fields: z.infer<typeof formSchema>) => {
    const directionService = new google.maps.DirectionsService();
    try {
      const results = await directionService.route({
        origin: fields.origin,
        destination: fields.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text);
      setDuration(results.routes[0].legs[0].duration?.text);
      setDirectionsError(false);

      if (!isLastStep) return next();
      if (distance && duration) {
        createTrip({
          origin: fields.origin,
          destination: fields.destination,
          status: Status.BOOKED,
          distance: parseFloat(distance?.replace(/[^\d.]/g, "")),
          duration: parseInt(duration?.replace(/[^\d.]/g, "")),
          price:
            parseFloat(distance?.replace(/[^\d.]/g, "")) +
            parseInt(duration?.replace(/[^\d.]/g, "")),
          scheduleDate: fields.tripDate,
          scheduleTime: fields.tripTime,
          vehicleId: 1,
        });
        return toast({
          title: "Trip booked successfully",
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
  };
  console.log(currentStepIndex);
  return (
    <Form {...form}>
      <form className="w-[50%]" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader className="flex">
            <CardTitle className="flex items-center gap-2">
              {!isFirstStep && (
                <ArrowLeft
                  width={25}
                  height={25}
                  className="transition-transform duration-150 hover:-translate-x-1"
                  onClick={back}
                />
              )}
              Book a trip
            </CardTitle>
          </CardHeader>
          <CardContent>{formStep}</CardContent>
          <CardFooter className="justify-center">
            <Button className="w-1/2" type="submit">
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
export default SecondTripForm;
