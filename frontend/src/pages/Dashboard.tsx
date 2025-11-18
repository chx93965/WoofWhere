import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Plus, Users } from 'lucide-react';
import { userApi } from '@/api/userApi';
import { partyApi } from '@/api/partyApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";


interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

interface Playdate {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  description: string;
}

export default function Dashboard() {
  const [playdates, setPlaydates] = useState<Playdate[]>([]);
  const [selectedPlaydate, setSelectedPlaydate] = useState<Playdate | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const userData = await userApi.getAll();
      const formattedUsers = userData.users.map((u: any) => {
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          age: u.age,
          isActive: u.isActive,
        };
      });
      setUsers(formattedUsers);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    // const stored = localStorage.getItem('playdates');
    // if (stored) {
    //   setPlaydates(JSON.parse(stored));
    // } else {
    //   const mockPlaydates: Playdate[] = [
    //     {
    //       id: '1',
    //       title: 'Morning Park Run',
    //       location: 'Central Park',
    //       date: '2025-11-15',
    //       time: '09:00',
    //       attendees: 5,
    //       description: 'Energetic morning run for active dogs',
    //       hostName: 'Sarah',
    //     },
    //     {
    //       id: '2',
    //       title: 'Small Breed Social',
    //       location: 'Riverside Dog Park',
    //       date: '2025-11-16',
    //       time: '15:00',
    //       attendees: 3,
    //       description: 'Perfect for small breeds to socialize',
    //       hostName: 'Mike',
    //     },
    //   ];
    //   setPlaydates(mockPlaydates);
    //   localStorage.setItem('playdates', JSON.stringify(mockPlaydates));
    // }
    const loadPlaydates = async () => {
      const partyData = await partyApi.getAll({ includePets: true });
      const formattedPlaydates = partyData.parties.map((p: any) => {
        const dateObj = new Date(p.date);
        return {
            id: p.id,
            title: p.title,
            location: p.location,
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toISOString().split('T')[1].substring(0,5),
            attendees: p.pets?.length ?? 0,
            description: p.description ?? "No description provided",
          };
      });
      setPlaydates(formattedPlaydates);
    };
    loadPlaydates();
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
                {users.filter((u) => u.isActive).length}
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
                  <Button className="w-full mt-4" onClick={() => {
    setSelectedPlaydate(playdate);
    setShowDialog(true);
  }}>Join Playdate</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        {selectedPlaydate?.title}
      </DialogTitle>
      <DialogDescription>
        Review details before confirming your booking.
      </DialogDescription>
    </DialogHeader>

    {selectedPlaydate && (
      <div className="space-y-3">
        <p><strong>Description:</strong> {selectedPlaydate.description}</p>
        <p><strong>Host:</strong> {selectedPlaydate.hostName}</p>
        <p><strong>Date:</strong> {new Date(selectedPlaydate.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {selectedPlaydate.time}</p>
        <p><strong>Location:</strong> {selectedPlaydate.location}</p>
        <p><strong>Attendees:</strong> {selectedPlaydate.attendees}</p>
      </div>
    )}

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setShowDialog(false)}
      >
        Cancel
      </Button>
      <Button
  onClick={() => {
    if (!selectedPlaydate) return;
    const updated = playdates.map((p) =>
      p.id === selectedPlaydate.id
        ? { ...p, attendees: p.attendees + 1 }
        : p
    );

    setPlaydates(updated);
    localStorage.setItem("playdates", JSON.stringify(updated));

    setShowDialog(false);
    toast({
      title: "Successfully booked! 🎉",
      description: `You're now attending "${selectedPlaydate.title}"🥳.`,
    });
  }}
>
  Confirm Booking
</Button>

    </DialogFooter>
  </DialogContent>
</Dialog>

      </main>
    </div>
  );
}