import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { petApi } from '@/api/petApi';
import { partyApi } from '@/api/partyApi';

export default function CreatePlaydate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    petId: '',
    description: '',
  });
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const profile = localStorage.getItem('profile');
        if (!profile) throw new Error('User profile not found');
        const { id: userId } = JSON.parse(profile);

        const response = await petApi.getByOwner(userId);
        setPets(response.pets);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };

    loadPets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // const storedPlaydates = localStorage.getItem('playdates');
    // const playdates = storedPlaydates ? JSON.parse(storedPlaydates) : [];
    //
    // const profile = localStorage.getItem('profile');
    // const userName = profile ? JSON.parse(profile).name : 'Anonymous';
    //
    // const newPlaydate = {
    //   id: Math.random().toString(36).substr(2, 9),
    //   ...formData,
    //   attendees: 1,
    //   hostName: userName,
    // };
    //
    // playdates.push(newPlaydate);
    // localStorage.setItem('playdates', JSON.stringify(playdates));

    // Get user id
    // Get user's pets' ids
    // Post playdate
    // Add pets to playdate
    try {
      const createPartyResponse = await partyApi.create({
        title: formData.title,
        location: formData.location,
        date: `${formData.date}T${formData.time}`,
        description: formData.description,
      });
      const partyId = createPartyResponse.id;
      console.log('Created playdate with ID:', partyId);

      // Add selected pet to the created playdate
      if (formData.petId) {
        await partyApi.addPet(partyId, formData.petId);
      }

      console.log('Pet added to playdate:', formData.petId);
      toast({
        title: 'Playdate Created!',
        description: `Your playdate has been scheduled successfully.`,
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating playdate:', error);
      toast({
        title: 'Error',
        description: `${(error)}`,
      })
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <Navigation />
      <main className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Schedule a Playdate 🐕</CardTitle>
            <CardDescription>
              Arrange a fun meetup for your furry friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Morning Park Run"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Central Park"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="petId">Attendee</Label>
                <Select
                    value={formData.petId}
                    onValueChange={(value) => setFormData({ ...formData, petId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet: any) => (
                        <SelectItem key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell others what to expect at this playdate..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" size="lg">
                  Create Playdate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
