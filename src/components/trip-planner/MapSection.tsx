import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Navigation, Layers } from "lucide-react";

interface MapSectionProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    label: string;
  }>;
  onMarkerAdd?: (position: { lat: number; lng: number }) => void;
  onMarkerDrag?: (id: string, position: { lat: number; lng: number }) => void;
}

const defaultMarkers = [
  {
    id: "1",
    position: { lat: 37.7749, lng: -122.4194 },
    label: "San Francisco",
  },
  {
    id: "2",
    position: { lat: 34.0522, lng: -118.2437 },
    label: "Los Angeles",
  },
  {
    id: "3",
    position: { lat: 32.7157, lng: -117.1611 },
    label: "San Diego",
  },
];

const MapSection = ({
  center = { lat: 36.7783, lng: -119.4179 },
  zoom = 6,
  markers = defaultMarkers,
  onMarkerAdd = () => {},
  onMarkerDrag = () => {},
}: MapSectionProps) => {
  return (
    <Card className="relative w-full h-full bg-slate-100 overflow-hidden">
      {/* Map placeholder - in a real implementation this would be replaced with a mapping library */}
      <div className="absolute inset-0 bg-slate-200">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${center.lng},${center.lat},${zoom}/1012x982?access_token=placeholder')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Markers */}
        {markers.map((marker, index) => (
          <div
            key={marker.id}
            className="absolute w-6 h-6 -ml-3 -mt-3 cursor-move"
            style={{
              left: `${(marker.position.lng + 180) * (100 / 360)}%`,
              top: `${(90 - marker.position.lat) * (100 / 180)}%`,
            }}
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
              {index + 1}
            </div>
            <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded text-sm shadow">
              {marker.label}
            </div>
          </div>
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Navigation className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Route line visualization - simplified representation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d={markers
            .map((marker, i) => {
              const x = (marker.position.lng + 180) * (100 / 360) + "%";
              const y = (90 - marker.position.lat) * (100 / 180) + "%";
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ")}
          stroke="#2563eb"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
        />
      </svg>
    </Card>
  );
};

export default MapSection;
