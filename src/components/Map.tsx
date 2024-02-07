"use client";
import "./Map.css";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useMemo, useState } from "react";

import TripForm from "./form/TripForm";
import VehicleList from "./VehicleList";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { Card, CardContent } from "./ui/card";

type Location = {
  lat: number;
  lng: number;
};
const Map = () => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const { isMobile } = useIsMobile();
  const containerStyle = {
    width: isMobile ? "300px" : "500px",
    height: isMobile ? "300px" : "500px",
  };
  const [center, setCenter] = useState<Location>({
    lat: 39.0458,
    lng: -76.6413,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: useMemo(() => ["places"], []),
  });

  return isLoaded ? (
    <div className="mt-10 flex items-center justify-center gap-5 md:flex-row flex-col-reverse md:justify-between md:gap-0">
      <TripForm setDirectionsResponse={setDirectionsResponse} />
      <div className="flex items-center justify-center">
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
