import React from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain } from "lucide-react";

interface Stop {
  id: string;
  location: string;
  notes?: string;
  weather: {
    temp: number;
    condition: "sunny" | "cloudy" | "rainy";
  };
  estimatedDuration: string;
}

interface StopsListProps {
  stops?: Stop[];
  onReorder?: (startIndex: number, endIndex: number) => void;
  onDeleteStop?: (stopId: string) => void;
  onEditStop?: (stopId: string) => void;
}

const defaultStops: Stop[] = [
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
];

const WeatherIcon = ({
  condition,
}: {
  condition: Stop["weather"]["condition"];
}) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-5 w-5 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="h-5 w-5 text-gray-500" />;
    case "rainy":
      return <CloudRain className="h-5 w-5 text-blue-500" />;
  }
};

const StopsList = ({
  stops = defaultStops,
  onReorder = () => {},
  onDeleteStop = () => {},
  onEditStop = () => {},
}: StopsListProps) => {
  return (
    <div className="w-full h-full bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trip Stops</h2>
        <Button variant="outline" size="sm">
          Add Stop
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <Card
              key={stop.id}
              className="p-4 cursor-move hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <DragHandleDots2Icon className="h-5 w-5 mt-1 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{stop.location}</h3>
                    <div className="flex items-center gap-2">
                      <WeatherIcon condition={stop.weather.condition} />
                      <span className="text-sm">{stop.weather.temp}°F</span>
                    </div>
                  </div>

                  {stop.notes && (
                    <p className="text-sm text-gray-500 mt-1">{stop.notes}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {index === 0
                        ? "Start"
                        : index === stops.length - 1
                          ? "End"
                          : `Stop ${index}`}
                    </Badge>
                    <Badge variant="outline">{stop.estimatedDuration}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StopsList;
