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
import { ReactElement, useState } from "react";
import { Status } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "../ui/use-toast";
import { useMultistepForm } from "@/app/hooks/useMutlistepForm";
import TripDetailsForm from "./TripDetailsForm";
import VehicleSelectionForm from "./VehicleSelectionForm";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircleIcon,
  Circle,
  CircleDot,
  Edit,
  Pencil,
  SquareDot,
} from "lucide-react";
import PaymentForm from "./PaymentForm";
import { calculatePrice } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { format } from "path";

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
  setDirectionsResponse: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  >;
}
const TripForm: React.FC<TripFormProps> = ({ setDirectionsResponse }) => {
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
      vehicleId: 1,
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
      name="Trip Details"
      form={form}
      directionsError={directionsError}
      setDirectionsError={setDirectionsError}
    />,
    <VehicleSelectionForm name="Select Vehicle" form={form} />,
  ]);
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        window.location.href = url;
      }
    },
  });
  const { mutate: createTrip } = trpc.createTrip.useMutation();
  const { toast } = useToast();
  const handleSubmit = async (fields: z.infer<typeof formSchema>) => {
    console.log("rr");
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
        const price = calculatePrice(
          parseFloat(distance?.replace(/[^\d.]/g, "")),
          parseInt(duration?.replace(/[^\d.]/g, "")),
        );
        createTrip({
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
        createStripeSession({ price: price });
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

  return (
    <Form {...form}>
      <form
        className="w-full md:w-[50%]  "
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card className="">
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
              Book a trip {currentStepIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              value={`item-${currentStepIndex}`}
              collapsible
            >
              {steps.map((step, idx) => {
                return (
                  <AccordionItem value={`item-${idx}`}>
                    <div>
                      <AccordionTrigger className="mb-3 cursor-default flex-col rounded-md bg-primary px-5 font-semibold text-white hover:no-underline">
                        <div className="flex w-full justify-between">
                          <div>
                            Step {idx + 1}: {step.props.name}
                          </div>
                          {currentStepIndex !== idx ? (
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
                                <CalendarDays />
                                {form.getValues().tripDate},{" "}
                                {form.getValues().tripTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <CircleDot width={20} />
                                {form.getValues().origin}
                              </div>
                              <div className="flex items-center gap-1">
                                <SquareDot width={20} />
                                {form.getValues().destination}
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
              {isLastStep ? "Checkout" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
export default TripForm;
