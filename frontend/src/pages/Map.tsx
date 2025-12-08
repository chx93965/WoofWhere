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
  location: string;
  date: string;
  time: string;
  attendees: number;
  hostName: string;
  coordinates?: [number, number];
}

export default function Map() {
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Function to geocode a location string to coordinates
  async function geocodeLocation(location: string): Promise<[number, number] | null> {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${mapboxgl.accessToken}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length > 0) {
        return data.features[0].center; // [lng, lat]
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    return null;
  }

  // Load playdates from localStorage and geocode missing coordinates
  useEffect(() => {
    async function loadPlaydates() {
      const stored = localStorage.getItem("playdates");
      if (!stored) return;

      let parsed: Playdate[] = JSON.parse(stored);

      // Fill missing coordinates
      for (const p of parsed) {
        if (!p.coordinates) {
          const coords = await geocodeLocation(p.location);
          if (coords) p.coordinates = coords;
        }
      }

      localStorage.setItem("playdates", JSON.stringify(parsed));
      setPlaydates(parsed);
    }

    loadPlaydates();
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-79.3832, 43.6532], // Toronto default
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Add markers for playdates (once coordinates are ready)
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];
    const pawIconUrl = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

    playdates.forEach((p) => {
      if (p.coordinates) {
        const el = document.createElement("div");
        el.style.backgroundImage = `url(${pawIconUrl})`;
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.backgroundSize = "contain";
        el.style.backgroundRepeat = "no-repeat";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
          .setLngLat(p.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3 style="font-weight:600;">${p.title}</h3>
              <p>${p.location}</p>
              <p>${p.hostName}</p>
              <p>${new Date(p.date).toLocaleDateString()} at ${p.time}</p>
            `)
          )
          .addTo(map);

        markers.push(marker);
      }
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [playdates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <Navigation />
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Playdate Locations</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] overflow-hidden bg-muted/50 relative">
              <CardContent className="p-0 h-full">
                <div ref={mapContainerRef} className="w-full h-full rounded-2xl" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar list */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">All Locations</h2>
            {playdates.map((playdate) => (
              <Card key={playdate.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{playdate.title}</CardTitle>
                  <CardDescription>Hosted by {playdate.hostName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{playdate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(playdate.date).toLocaleDateString()} at {playdate.time}
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {playdate.attendees} attendee{playdate.attendees !== 1 ? 's' : ''}
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
