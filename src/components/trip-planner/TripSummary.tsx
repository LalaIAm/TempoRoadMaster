import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Route, Fuel } from "lucide-react";

interface TripSummaryProps {
  totalDistance?: string;
  duration?: string;
  fuelCost?: string;
}

const TripSummary = ({
  totalDistance = "0 miles",
  duration = "0 hours",
  fuelCost = "$0.00",
}: TripSummaryProps) => {
  return (
    <Card className="w-full h-[200px] p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">Total Distance</span>
          </div>
          <span className="font-medium">{totalDistance}</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">Duration</span>
          </div>
          <span className="font-medium">{duration}</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">Estimated Fuel Cost</span>
          </div>
          <span className="font-medium">{fuelCost}</span>
        </div>
      </div>
    </Card>
  );
};

export default TripSummary;
