import React from "react";
import MapSection from "./trip-planner/MapSection";
import TripSidebar from "./trip-planner/TripSidebar";

interface HomeProps {
  tripData?: {
    summary?: {
      totalDistance: string;
      duration: string;
      fuelCost: string;
    };
    stops?: Array<{
      id: string;
      location: string;
      notes?: string;
      weather: {
        temp: number;
        condition: "sunny" | "cloudy" | "rainy";
      };
      estimatedDuration: string;
    }>;
    mapCenter?: {
      lat: number;
      lng: number;
    };
    zoom?: number;
  };
}

const defaultTripData = {
  summary: {
    totalDistance: "450 miles",
    duration: "8 hours",
    fuelCost: "$85.50",
  },
  stops: [
    {
      id: "1",
      location: "San Francisco, CA",
      notes: "Starting point",
      weather: { temp: 68, condition: "sunny" },
      estimatedDuration: "0h",
    },
    {
      id: "2",
      location: "Los Angeles, CA",
      notes: "Lunch stop",
      weather: { temp: 75, condition: "cloudy" },
      estimatedDuration: "6h",
    },
    {
      id: "3",
      location: "San Diego, CA",
      notes: "Final destination",
      weather: { temp: 72, condition: "rainy" },
      estimatedDuration: "8h",
    },
  ],
  mapCenter: { lat: 36.7783, lng: -119.4179 },
  zoom: 6,
};

const Home = ({ tripData = defaultTripData }: HomeProps) => {
  const handleReorderStops = (startIndex: number, endIndex: number) => {
    console.log("Reordering stops:", { startIndex, endIndex });
  };

  const handleDeleteStop = (stopId: string) => {
    console.log("Deleting stop:", stopId);
  };

  const handleEditStop = (stopId: string) => {
    console.log("Editing stop:", stopId);
  };

  const handleMarkerAdd = (position: { lat: number; lng: number }) => {
    console.log("Adding marker at:", position);
  };

  const handleMarkerDrag = (
    id: string,
    position: { lat: number; lng: number },
  ) => {
    console.log("Dragging marker:", { id, position });
  };

  return (
    <div className="flex w-full h-screen bg-background">
      <div className="flex-1">
        <MapSection
          center={tripData.mapCenter}
          zoom={tripData.zoom}
          markers={tripData.stops?.map((stop) => ({
            id: stop.id,
            position: { lat: 0, lng: 0 }, // In real app, these would come from geocoding
            label: stop.location,
          }))}
          onMarkerAdd={handleMarkerAdd}
          onMarkerDrag={handleMarkerDrag}
        />
      </div>

      <TripSidebar
        tripSummary={tripData.summary}
        stops={tripData.stops}
        onReorderStops={handleReorderStops}
        onDeleteStop={handleDeleteStop}
        onEditStop={handleEditStop}
      />
    </div>
  );
};

export default Home;
