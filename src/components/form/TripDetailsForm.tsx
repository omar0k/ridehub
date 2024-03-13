import Autocomplete from "react-google-autocomplete";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormInfoData } from "@/types";
import { DatePicker } from "../ui/datepicker";
interface TripDetailsFormProps {
  form: UseFormReturn<FormInfoData>;
  setDirectionsError: React.Dispatch<React.SetStateAction<boolean>>;
  directionsError: boolean;
  name: string;
}

const TripDetailsForm: React.FC<TripDetailsFormProps> = ({
  form,
  setDirectionsError,
  directionsError,
  name,
}) => {
  return (
    <div className="flex  flex-col gap-2 px-1 ">
      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => {
          return (
            <div className="">
              <FormItem>
                <FormLabel>Pick Up</FormLabel>
                <FormControl>
                  <Autocomplete
                    autoFocus
                    className={`custom-input ${directionsError ? "!border-2 !border-red-500" : ""}`}
                    {...field}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      if (place.formatted_address) {
                        form.setValue("origin", place.formatted_address);
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
        name="destination"
        render={({ field }) => {
          return (
            <div>
              <FormItem>
                <FormLabel>Drop Off</FormLabel>
                <FormControl>
                  <Autocomplete
                    {...field}
                    className={`custom-input ${directionsError ? "!border-2 !border-red-500" : ""}`}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      if (place.formatted_address) {
                        form.setValue("destination", place.formatted_address);
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
        name="tripDate"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                {/* <Input {...field} type="date" min={currentDateString} /> */}
                <DatePicker
                  {...field}
                  date={new Date(field.value)}
                  setDate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name="tripTime"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input {...field} type="time" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
export default TripDetailsForm;
