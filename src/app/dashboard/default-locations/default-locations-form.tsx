"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DefaultLocationsFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "react-google-autocomplete";
import { UseFormReturn, useForm } from "react-hook-form";
import { TypeOf, z } from "zod";
const DefaultLocationsSchema = z.object({
  defaultPickUpLocation: z.string(),
  defaultDropOffLocation: z.string(),
});

const DefaultLocationsForm = () => {
  const { data: user } = trpc.getUser.useQuery();
  const form = useForm<z.infer<typeof DefaultLocationsSchema>>({
    resolver: zodResolver(DefaultLocationsSchema),
    defaultValues: {
      defaultDropOffLocation: user?.savedDropOffLocation
        ? user.savedDropOffLocation
        : "",
      defaultPickUpLocation: user?.savedDropOffLocation
        ? user.savedDropOffLocation
        : "",
    },
  });
  const handleSubmit = (fields: z.infer<typeof DefaultLocationsSchema>) => {
    console.log(fields);
  };
  return (
    <div className="flex h-full  flex-grow-0 flex-col">
      <CardHeader className="flex items-center justify-center">
        <h3 className="text-2xl font-semibold">Default Locations</h3>
      </CardHeader>
      <CardContent className="w-1/3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="defaultDropOffLocation"
              render={({ field }) => {
                return (
                  <div className="">
                    <FormItem>
                      <FormLabel>Pick Up</FormLabel>
                      <FormControl>
                        <Autocomplete
                          className="custom-input"
                          autoFocus
                          {...field}
                          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                          onPlaceSelected={(place) => {
                            if (place.formatted_address) {
                              form.setValue(
                                "defaultDropOffLocation",
                                place.formatted_address,
                              );
                            }
                          }}
                          options={{
                            componentRestrictions: { country: "US" },
                            types: ["geocode", "establishment"],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                );
              }}
            />
            <FormField
              control={form.control}
              name="defaultPickUpLocation"
              render={({ field }) => {
                return (
                  <div>
                    <FormItem>
                      <FormLabel>Drop Off</FormLabel>
                      <FormControl>
                        <Autocomplete
                          className="custom-input"
                          {...field}
                          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                          onPlaceSelected={(place) => {
                            if (place.formatted_address) {
                              form.setValue(
                                "defaultPickUpLocation",
                                place.formatted_address,
                              );
                            }
                          }}
                          options={{
                            componentRestrictions: { country: "US" },
                            types: ["geocode", "establishment"],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                );
              }}
            />
            <div className="flex items-center">
              <Button type="submit" size={"lg"}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};
export default DefaultLocationsForm;
