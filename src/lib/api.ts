import { supabase } from "./supabase";
import { Trip, TripStop } from "./types";

export async function saveTrip(trip: Omit<Trip, "id">) {
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .insert([
      {
        title: trip.title,
        total_distance: trip.totalDistance,
        duration: trip.duration,
        fuel_cost: trip.fuelCost,
        map_center: trip.mapCenter,
        zoom: trip.zoom,
      },
    ])
    .select()
    .single();

  if (tripError) throw tripError;

  const stopsToInsert = trip.stops.map((stop, index) => ({
    trip_id: tripData.id,
    location: stop.location,
    notes: stop.notes,
    position: stop.position,
    weather_temp: stop.weather.temp,
    weather_condition: stop.weather.condition,
    estimated_duration: stop.estimatedDuration,
    order_index: index,
  }));

  const { error: stopsError } = await supabase
    .from("stops")
    .insert(stopsToInsert);

  if (stopsError) throw stopsError;

  return tripData.id;
}

export async function loadTrip(tripId: string): Promise<Trip> {
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (tripError) throw tripError;

  const { data: stopsData, error: stopsError } = await supabase
    .from("stops")
    .select("*")
    .eq("trip_id", tripId)
    .order("order_index");

  if (stopsError) throw stopsError;

  const stops: TripStop[] = stopsData.map((stop) => ({
    id: stop.id,
    location: stop.location,
    notes: stop.notes,
    position: stop.position,
    weather: {
      temp: stop.weather_temp,
      condition: stop.weather_condition,
    },
    estimatedDuration: stop.estimated_duration,
    orderIndex: stop.order_index,
  }));

  return {
    id: tripData.id,
    title: tripData.title,
    totalDistance: tripData.total_distance,
    duration: tripData.duration,
    fuelCost: tripData.fuel_cost,
    mapCenter: tripData.map_center,
    zoom: tripData.zoom,
    stops,
  };
}

export async function updateTrip(tripId: string, updates: Partial<Trip>) {
  const { error: tripError } = await supabase
    .from("trips")
    .update({
      title: updates.title,
      total_distance: updates.totalDistance,
      duration: updates.duration,
      fuel_cost: updates.fuelCost,
      map_center: updates.mapCenter,
      zoom: updates.zoom,
    })
    .eq("id", tripId);

  if (tripError) throw tripError;

  if (updates.stops) {
    // Delete existing stops
    await supabase.from("stops").delete().eq("trip_id", tripId);

    // Insert new stops
    const stopsToInsert = updates.stops.map((stop, index) => ({
      trip_id: tripId,
      location: stop.location,
      notes: stop.notes,
      position: stop.position,
      weather_temp: stop.weather.temp,
      weather_condition: stop.weather.condition,
      estimated_duration: stop.estimatedDuration,
      order_index: index,
    }));

    const { error: stopsError } = await supabase
      .from("stops")
      .insert(stopsToInsert);

    if (stopsError) throw stopsError;
  }
}

export async function listTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteTrip(tripId: string) {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  if (error) throw error;
}
