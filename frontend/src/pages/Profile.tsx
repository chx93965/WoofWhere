import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { userApi } from '@/api/userApi';
import { petApi } from '@/api/petApi';
import { ChatSection } from '@/components/ChatSection';

interface Profile {
  id: string;
  name: string;
  email: string;
  age: number;
}

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
}

export default function Profile() {
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = true;
  const isLoading = false;

  useEffect(() => {
      if (!user) {
          navigate('/login');
          return;
      }
  }, [user, navigate]);


  const [userForm, setUserForm] = useState<Profile>({
    id: '',
    name: '',
    email: '',
    age: 0,
  });
  const [petForm, setPetForm] = useState<Pet>({
    id: '',
    name: '',
    breed: '',
    age: 0,
    size: 'medium',
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    const storedPet = localStorage.getItem('pet');

    if (storedProfile) setUserForm(JSON.parse(storedProfile));
    if (storedPet) setPetForm(JSON.parse(storedPet));
  }, []);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update user
    try {
      console.log("Updating user with data:", userForm);
      const payload = Object.fromEntries(
          Object.entries({
            name: userForm.name,
            email: userForm.email,
            age: userForm.age,
          }).filter(([_, value]) =>
              value !== "" && value !== '' && value !== 0 && value !== null && value !== undefined)
      );
      const response = await userApi.update(user.id, payload);

      localStorage.setItem('profile', JSON.stringify({...userForm, id: user.id}));
      setUser(response.data);

      console.log('User updated with ID:', user.id);
      toast({
        title: 'Profile Updated',
        description: `Your profile has been saved successfully.`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Post pet
    try {
      const response = await petApi.create({
        name: petForm.name,
        breed: petForm.breed,
        size: petForm.size,
        age: petForm.age,
        ownerId: user.id
      });

      localStorage.setItem('pet', JSON.stringify({...petForm, id: response.data.id}));
      console.log('Pet added with ID:', response.data.id);
      toast({
        title: 'Pet Profile Updated',
        description: `${petForm.name}'s profile has been saved successfully.`,
      });
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navigation />
      </div>

      {/* Add padding to avoid content going under the fixed nav */}
      <div className="pt-[64px]">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            Loading...
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold mb-4">Please log in to access your profile</h1>
            {/*<Button onClick={() => loginWithRedirect()}>Log In</Button>*/}
          </div>
        ) : (
          <main className="container py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

            <Tabs defaultValue="user" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="user">Your Profile</TabsTrigger>
                <TabsTrigger value="pet">Pet Profile</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={userForm.name}
                          placeholder={user.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          placeholder={user.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            min="0"
                            max="150"
                            value={userForm.age}
                            placeholder={user.name? user.name : 0}
                            onChange={(e) => setUserForm({ ...userForm, age: parseInt(e.target.value) })}
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pet">
                <Card>
                  <CardHeader>
                    <CardTitle>Pet Information 🐕</CardTitle>
                    <CardDescription>Tell us about your furry friend</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePetSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="petName">Pet Name</Label>
                        <Input
                          id="petName"
                          value={petForm.name}
                          onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="breed">Breed</Label>
                        <Input
                          id="breed"
                          value={petForm.breed}
                          onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age (years)</Label>
                          <Input
                              id="age"
                              type="number"
                              min="0"
                              max="50"
                              value={petForm.age}
                              onChange={(e) => setPetForm({ ...petForm, age: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="size">Size</Label>
                          <Select
                            value={petForm.size}
                            onValueChange={(value) => setPetForm({ ...petForm, size: value as 'small' | 'medium' | 'large' })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit">Save Pet Profile</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="chat">
  <Card>
    <CardHeader>
      <CardTitle>Chat</CardTitle>
      <CardDescription>Send and receive messages in real time</CardDescription>
    </CardHeader>
    <CardContent>
      <ChatSection />
    </CardContent>
  </Card>
</TabsContent>
            </Tabs>
          </main>
        )}
      </div>
    </div>
  );
}
