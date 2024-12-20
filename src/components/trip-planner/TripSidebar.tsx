import React from "react";
import TripSummary from "./TripSummary";
import StopsList from "./StopsList";

interface TripSidebarProps {
  tripSummary?: {
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
  onReorderStops?: (startIndex: number, endIndex: number) => void;
  onDeleteStop?: (stopId: string) => void;
  onEditStop?: (stopId: string) => void;
}

const defaultTripSummary = {
  totalDistance: "450 miles",
  duration: "8 hours",
  fuelCost: "$85.50",
};

const TripSidebar = ({
  tripSummary = defaultTripSummary,
  stops,
  onReorderStops,
  onDeleteStop,
  onEditStop,
}: TripSidebarProps) => {
  return (
    <div className="w-[500px] h-full bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Trip Details</h1>
        <TripSummary
          totalDistance={tripSummary.totalDistance}
          duration={tripSummary.duration}
          fuelCost={tripSummary.fuelCost}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <StopsList
          stops={stops}
          onReorder={onReorderStops}
          onDeleteStop={onDeleteStop}
          onEditStop={onEditStop}
        />
      </div>
    </div>
  );
};

export default TripSidebar;
