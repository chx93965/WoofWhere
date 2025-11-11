import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Plus, Users } from 'lucide-react';

interface Playdate {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  description: string;
  hostName: string;
}

export default function Dashboard() {
  const [playdates, setPlaydates] = useState<Playdate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('playdates');
    if (stored) {
      setPlaydates(JSON.parse(stored));
    } else {
      const mockPlaydates: Playdate[] = [
        {
          id: '1',
          title: 'Morning Park Run',
          location: 'Central Park',
          date: '2025-11-15',
          time: '09:00',
          attendees: 5,
          description: 'Energetic morning run for active dogs',
          hostName: 'Sarah',
        },
        {
          id: '2',
          title: 'Small Breed Social',
          location: 'Riverside Dog Park',
          date: '2025-11-16',
          time: '15:00',
          attendees: 3,
          description: 'Perfect for small breeds to socialize',
          hostName: 'Mike',
        },
      ];
      setPlaydates(mockPlaydates);
      localStorage.setItem('playdates', JSON.stringify(mockPlaydates));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <Navigation />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to WoofWhere
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect your furry friends for amazing playdates
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Playdates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{playdates.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                {playdates.reduce((sum, p) => sum + p.attendees, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Active members</p>
            </CardContent>
          </Card>

          <Link to="/create-playdate" className="md:col-span-2 lg:col-span-1">
            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors h-full cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-accent" />
                  Schedule New
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Create a new playdate</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Playdates</h2>
            <Link to="/create-playdate">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Playdate
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {playdates.map((playdate) => (
              <Card key={playdate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{playdate.title}</CardTitle>
                      <CardDescription>Hosted by {playdate.hostName}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {playdate.attendees}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{playdate.description}</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(playdate.date).toLocaleDateString()} at {playdate.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {playdate.location}
                    </div>
                  </div>
                  <Button className="w-full mt-4">Join Playdate</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
