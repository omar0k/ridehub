"use client";
import "./Map.css";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import React, { useMemo, useState } from "react";

import TripForm from "./TripForm";
import VehicleList from "./VehicleList";

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: useMemo(() => ["places"], []),
  });

  return isLoaded ? (
    <div className="mt-10 flex items-center justify-between">
      <TripForm setDirectionsResponse={setDirectionsResponse} />
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
      <VehicleList />
    </div>
  ) : (
    <></>
  );
};
export default Map;
