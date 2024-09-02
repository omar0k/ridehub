"use client";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useMemo, useState } from "react";
import "./Map.css";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import TripForm from "./form/TripForm";

type Location = {
  lat: number;
  lng: number;
};

const Map = ({ vehicleId }: { vehicleId?: number }) => {
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
    <div className="flex flex-col-reverse items-center justify-center gap-5 md:justify-between md:gap-0 lg:flex-row">
      <TripForm
        vehicleId={vehicleId}
        setDirectionsResponse={setDirectionsResponse}
        directionsResponse={directionsResponse}
      />
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
