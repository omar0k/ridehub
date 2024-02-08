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
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  const currentDateString = currentDate.toISOString().split("T")[0];
  return (
    <div className="px-1">
      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => {
          return (
            <div>
              <FormItem>
                <FormLabel>Pick Up</FormLabel>
                <FormControl className="">
                  <Autocomplete
                    className={`custom-input ${directionsError ? "!border-2 !border-red-500" : ""}`}
                    {...field}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={(place) => {
                      if (place?.formatted_address) {
                        form.setValue("origin", place?.formatted_address);
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
                    className={`custom-input ${directionsError ? "!border-2 !border-red-500" : ""}`}
                    {...field}
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
                <Input {...field} type="date" min={currentDateString} />
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
                <Input size={30} {...field} type="time" />
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
