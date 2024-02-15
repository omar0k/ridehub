import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { format, isValid } from "date-fns";
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
import {
  ArrowRight,
  CalendarDays,
  CircleDot,
  Clock3,
  Pencil,
  SquareDot,
  TrendingUp,
} from "lucide-react";
import { TestTripValues, calculatePrice } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

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
  vehicleId: z.number().min(1, { message: "Please select a vehicle" }),
});
interface TripFormProps {
  vehicleId: number | undefined;
  setDirectionsResponse: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
  directionsResponse: google.maps.DirectionsResult | null;
}
const TripForm: React.FC<TripFormProps> = ({
  vehicleId,
  directionsResponse,
  setDirectionsResponse,
}) => {
  const [distance, setDistance] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [directionsError, setDirectionsError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? TestTripValues
        : {
            origin: "",
            destination: "",
            tripDate: "",
            tripTime: "",
            vehicleId: vehicleId ? vehicleId : 1,
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
      key={"tripDetails"}
      name="Trip Details"
      form={form}
      directionsError={directionsError}
      setDirectionsError={setDirectionsError}
    />,
    <VehicleSelectionForm
      key={"vehicleSelection"}
      name="Select Vehicle"
      vehicleId={vehicleId}
      form={form}
    />,
  ]);
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url, trip }) => {
      console.log(trip);
      // if (url) {
      //   window.location.href = url;
      // }
    },
  });
  const { toast } = useToast();
  const handleSubmit = async (fields: z.infer<typeof formSchema>) => {
    try {
      if (!directionsResponse) {
        const directionService = new google.maps.DirectionsService();
        const results = await directionService.route({
          origin: fields.origin,
          destination: fields.destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance?.text);
        setDuration(results.routes[0].legs[0].duration?.text);
        setDirectionsError(false);
      }

      if (!isLastStep) return next();
      if (distance && duration) {
        const price = calculatePrice(
          parseFloat(distance?.replace(/[^\d.]/g, "")),
          parseInt(duration?.replace(/[^\d.]/g, "")),
        );
        createStripeSession({
          origin: fields.origin,
          destination: fields.destination,
          status: Status.BOOKED,
          distance: parseFloat(distance?.replace(/[^\d.]/g, "")),
          duration: parseInt(duration?.replace(/[^\d.]/g, "")),
          price: price,
          scheduleDate: fields.tripDate,
          scheduleTime: fields.tripTime,
          vehicleId: fields.vehicleId,
        });
        return toast({
          title: "Trip booked successfully",
          description: "Redirecting to payment...",
        });
      }
    } catch (error) {
      setDirectionsError(true);
      return toast({
        title: "Address not found",
        description: "Select locations from dropdown list",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full md:w-[50%]  "
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card className="">
          <CardHeader className="flex">
            <CardTitle className="flex items-center gap-2">
              Book a trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              key={currentStepIndex}
              value={`item-${currentStepIndex}`}
              collapsible
            >
              {steps.map((step, idx) => {
                return (
                  <AccordionItem key={step.key} value={`item-${idx}`}>
                    <div>
                      <AccordionTrigger className="mb-3 cursor-default flex-col rounded-md bg-primary px-5 font-semibold text-white hover:no-underline">
                        <div className="flex w-full justify-between">
                          <div>
                            Step {idx + 1}: {step.props.name}
                          </div>
                          {currentStepIndex !== idx &&
                          form.getValues().origin &&
                          form.getValues().destination &&
                          form.getValues().tripDate &&
                          form.getValues().tripTime ? (
                            <div
                              className="m-0 flex cursor-pointer items-center gap-1  hover:opacity-70"
                              onClick={() => goTo(idx)}
                            >
                              <Pencil width={15} height={15} />
                              Edit
                            </div>
                          ) : null}
                        </div>
                        <div className="flex w-full items-start justify-start">
                          {idx === 0 &&
                          currentStepIndex !== idx &&
                          form.getValues().origin ? (
                            <div className="flex-col">
                              <div className="flex items-center gap-1">
                                <CalendarDays width={20} />
                                {form.getValues().tripDate},{" "}
                                {format(
                                  new Date(
                                    `2000-01-01T${form.getValues().tripTime}`,
                                  ),
                                  "h:mm a",
                                )}
                              </div>
                              <div className="flex  items-center gap-1 text-start ">
                                <CircleDot width={20} />
                                {form.getValues().origin}
                              </div>
                              <div className="flex  items-center gap-1 text-start">
                                <SquareDot width={20} />
                                {form.getValues().destination}
                              </div>
                              <div className="flex items-center gap-1 text-start">
                                <Clock3 width={20} />
                                {duration}
                              </div>
                              <div className="flex items-center gap-1 text-start">
                                <TrendingUp width={20} />
                                {distance}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent>{step}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
          <CardFooter className="justify-center">
            <Button className="w-1/2" type="submit">
              {isLastStep ? (
                <div className="flex items-center gap-2 ">
                  Checkout <ArrowRight width={20} />
                </div>
              ) : (
                "Next"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
export default TripForm;
