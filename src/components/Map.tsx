"use client";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { SetStateAction, useMemo, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Location = {
  lat: number;
  lng: number;
};
const Map = () => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const containerStyle = {
    width: "600px",
    height: "600px",
  };
  const [center, setCenter] = useState<Location>({
    lat: 39.0458,
    lng: -76.6413,
  });
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [distance, setDistance] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult>();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: useMemo(() => ["places"], []),
  });
  const handleSubmit = async () => {
    if (
      originRef.current?.value !== "" &&
      originRef.current?.value !== undefined &&
      destinationRef.current?.value !== "" &&
      destinationRef.current?.value !== undefined
    ) {
      const directionService = new google.maps.DirectionsService();
      const results = await directionService.route({
        origin: originRef.current?.value,
        destination: destinationRef.current?.value,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text);
      setDuration(results.routes[0].legs[0].duration?.text);
    }
  };

  return isLoaded ? (
    <div className="mt-10 flex items-center justify-between">
      <div className="flex flex-col items-center justify-between gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Get a price</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Autocomplete types={["geocode"]} restrictions={{ country: "us" }}>
              <Input size={30} ref={originRef} placeholder="Enter location" />
            </Autocomplete>
            <Autocomplete restrictions={{ country: "us" }}>
              <Input
                size={30}
                ref={destinationRef}
                placeholder="Enter destination"
              />
            </Autocomplete>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-5">
            <Button className="w-full" onClick={handleSubmit}>
              See Prices
            </Button>
            <div>
              <p>Distance: {distance}</p>
              <p>Duration: {duration}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="">
        <GoogleMap
          onLoad={(map) => setMap(map)}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default Map;
