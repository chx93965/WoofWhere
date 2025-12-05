import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Playdate {
  id: string;
  title: string;
  location: string;       // Address string
  date: string;
  time: string;
  attendees: number;
  hostName: string;
  coordinates?: [number, number]; // Optional saved coords
}

export default function Map() {
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Load playdates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('playdates');
    if (stored) {
      setPlaydates(JSON.parse(stored));
    }
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-79.3832, 43.6532], // Toronto starter center
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => map.remove();
  }, []);

  
  useEffect(() => {
    if (!mapRef.current) return;

    //Dummy data
    setPlaydates([
      {
        id: "test-1",
        title: "Test Playdate",
        location: "545 Sherbourne St, Toronto",
        date: "2025-03-01",
        time: "4:00 PM",
        attendees: 3,
        hostName: "John Doe"
      }
    ]);
    //Dummy data 

    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];
    const pawIconUrl = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; 

    playdates.forEach(async (p) => {
      if (p.coordinates) {
        const el = document.createElement("div");
        el.style.backgroundImage = `url(${pawIconUrl})`;
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.backgroundSize = "contain";
        el.style.backgroundRepeat = "no-repeat";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(p.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3 style="font-weight:600;">${p.title}</h3>
              <p>${p.location}</p>
              <p>Hosted by ${p.hostName}</p>
              <p>${new Date(p.date).toLocaleDateString()} at ${p.time}</p>
            `)
          )
          .addTo(map);

        markers.push(marker);
        return;
      }

  
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        p.location
      )}.json?access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        const coords = data.features?.[0]?.center;

        if (!coords) {
          console.warn("Address not found:", p.location);
          return;
        }

        const el = document.createElement("div");
        el.style.backgroundImage = `url(${pawIconUrl})`;
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.backgroundSize = "contain";
        el.style.backgroundRepeat = "no-repeat";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3 style="font-weight:600;">${p.title}</h3>
              <p>${p.location}</p>
              <p>Hosted by ${p.hostName}</p>
              <p>${new Date(p.date).toLocaleDateString()} at ${p.time}</p>
            `)
          )
          .addTo(map);

        markers.push(marker);

      } catch (error) {
        console.error("Geocoding error:", error);
      }
    });

  
    return () => markers.forEach((m) => m.remove());
  }, [playdates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <Navigation />
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Playdate Locations</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {}
          <div className="lg:col-span-2">
            <Card className="h-[600px] overflow-hidden bg-muted/50 relative">
              <CardContent className="p-0 h-full">
                <div ref={mapContainerRef} className="w-full h-full rounded-2xl" />
              </CardContent>
            </Card>
          </div>

          {}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">All Locations</h2>

            {playdates.map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  <CardDescription>Hosted by {p.hostName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(p.date).toLocaleDateString()} at {p.time}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {p.attendees} attendee{p.attendees !== 1 ? "s" : ""}
                  </Badge>
                </CardContent>
              </Card>
            ))}

            {playdates.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No playdates scheduled yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}