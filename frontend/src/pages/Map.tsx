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
      center: [-79.3832, 43.6532], // 
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    // Add a few sample paw markers in Toronto
    const pawIconUrl = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; 

    const pawLocations: [number, number][] = [
      [-79.3832, 43.6532], 
      [-79.4000, 43.6650], 
      [-79.3700, 43.6400], 
    ];

    pawLocations.forEach(([lng, lat]) => {
      const el = document.createElement("div");
      el.style.backgroundImage = `url(${pawIconUrl})`;
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.cursor = "pointer";

      new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
    });

    return () => map.remove();
  }, []);

  // Add markers for stored playdates (if they exist)
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];

    playdates.forEach((p) => {
      if (p.coordinates) {
        const marker = new mapboxgl.Marker({ color: "#2563eb" })
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
                <div
                  ref={mapContainerRef}
                  className="w-full h-full rounded-2xl"
                />
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
