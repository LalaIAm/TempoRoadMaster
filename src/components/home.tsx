import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapSection from "./trip-planner/MapSection";
import TripSidebar from "./trip-planner/TripSidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  saveTrip,
  loadTrip,
  listTrips,
  deleteTrip,
  updateTrip,
} from "@/lib/api";
import { Trip } from "@/lib/types";
import { Save, FolderOpen, Plus } from "lucide-react";

const defaultTripData = {
  title: "New Trip",
  totalDistance: "0 miles",
  duration: "0 hours",
  fuelCost: "$0.00",
  stops: [],
  mapCenter: { lat: 36.7783, lng: -119.4179 },
  zoom: 6,
};

const Home = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip>(defaultTripData as Trip);
  const [savedTrips, setSavedTrips] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState("");

  useEffect(() => {
    if (tripId) {
      loadTrip(tripId).then(setTrip).catch(console.error);
    }
    listTrips().then(setSavedTrips).catch(console.error);
  }, [tripId]);

  const handleSaveTrip = async () => {
    try {
      if (trip.id) {
        await updateTrip(trip.id, {
          ...trip,
          title: newTripTitle || trip.title,
        });
      } else {
        const newTripId = await saveTrip({
          ...trip,
          title: newTripTitle || "New Trip",
        });
        navigate(`/trip/${newTripId}`);
      }
      setIsSaveDialogOpen(false);
      listTrips().then(setSavedTrips);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const handleLoadTrip = async (selectedTripId: string) => {
    try {
      navigate(`/trip/${selectedTripId}`);
      setIsLoadDialogOpen(false);
    } catch (error) {
      console.error("Error loading trip:", error);
    }
  };

  const handleDeleteTrip = async (selectedTripId: string) => {
    try {
      await deleteTrip(selectedTripId);
      if (selectedTripId === tripId) {
        navigate("/");
        setTrip(defaultTripData as Trip);
      }
      listTrips().then(setSavedTrips);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleReorderStops = (startIndex: number, endIndex: number) => {
    const newStops = [...trip.stops];
    const [removed] = newStops.splice(startIndex, 1);
    newStops.splice(endIndex, 0, removed);
    setTrip({ ...trip, stops: newStops });
  };

  const handleDeleteStop = (stopId: string) => {
    setTrip({
      ...trip,
      stops: trip.stops.filter((stop) => stop.id !== stopId),
    });
  };

  const handleMarkerAdd = (position: { lat: number; lng: number }) => {
    const newId = String(Date.now());
    const newLocation = `Location ${trip.stops.length + 1}`;

    const newStop = {
      id: newId,
      location: newLocation,
      position,
      weather: { temp: 70, condition: "sunny" as const },
      estimatedDuration: "0h",
      orderIndex: trip.stops.length,
    };

    setTrip({
      ...trip,
      stops: [...trip.stops, newStop],
    });
  };

  const handleMarkerDrag = (
    id: string,
    position: { lat: number; lng: number },
  ) => {
    setTrip({
      ...trip,
      stops: trip.stops.map((stop) =>
        stop.id === id ? { ...stop, position } : stop,
      ),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">{trip.title}</h1>
        <div className="flex gap-2">
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Trip</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Enter trip title"
                value={newTripTitle}
                onChange={(e) => setNewTripTitle(e.target.value)}
              />
              <Button onClick={handleSaveTrip}>Save</Button>
            </DialogContent>
          </Dialog>

          <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Load Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Trip</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {savedTrips.map((savedTrip) => (
                  <div
                    key={savedTrip.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span>{savedTrip.title}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleLoadTrip(savedTrip.id)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteTrip(savedTrip.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => {
              navigate("/");
              setTrip(defaultTripData as Trip);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Trip
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <MapSection
            center={trip.mapCenter}
            zoom={trip.zoom}
            markers={trip.stops.map((stop) => ({
              id: stop.id,
              position: stop.position,
              label: stop.location,
            }))}
            onMarkerAdd={handleMarkerAdd}
            onMarkerDrag={handleMarkerDrag}
            onMarkerDelete={handleDeleteStop}
          />
        </div>

        <TripSidebar
          tripSummary={{
            totalDistance: trip.totalDistance,
            duration: trip.duration,
            fuelCost: trip.fuelCost,
          }}
          stops={trip.stops}
          onReorderStops={handleReorderStops}
          onDeleteStop={handleDeleteStop}
        />
      </div>
    </div>
  );
};

export default Home;
