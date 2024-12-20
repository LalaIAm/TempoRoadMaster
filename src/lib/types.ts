export interface Trip {
  id: string;
  title: string;
  totalDistance: string;
  duration: string;
  fuelCost: string;
  mapCenter: {
    lat: number;
    lng: number;
  };
  zoom: number;
  stops: TripStop[];
}

export interface TripStop {
  id: string;
  location: string;
  notes?: string;
  position: {
    lat: number;
    lng: number;
  };
  weather: {
    temp: number;
    condition: "sunny" | "cloudy" | "rainy";
  };
  estimatedDuration: string;
  orderIndex: number;
}
