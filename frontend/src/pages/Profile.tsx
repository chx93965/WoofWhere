import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth0 } from '@auth0/auth0-react';
import { userApi } from '@/api/userApi';
import { petApi } from '@/api/petApi';

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
  let { user, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  // isAuthenticated = true;

  const [userForm, setUserForm] = useState<Profile>({
    name: '',
    email: '',
    age: 0,
  });
  const [petForm, setPetForm] = useState<Pet>({
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

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Post user
    try {
      console.log("Creating user with data:", userForm);
      const response = await userApi.create({
        name: userForm.name,
        email: userForm.email,
        age: userForm.age,
      });
      const userId = response.id;
      localStorage.setItem('profile', JSON.stringify({...userForm, id: userId}));

      console.log('User created with ID:', userId);
      toast({
        title: 'Profile Updated',
        description: `Your profile has been saved successfully.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handlePetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pet', JSON.stringify(petForm));

    // Get user id
    // Post pet
    try {
      const profile = localStorage.getItem('profile');
      if (!profile) throw new Error('User profile not found');
      const {id: userId} = JSON.parse(profile);

      const response = await petApi.create({
        name: petForm.name,
        breed: petForm.breed,
        size: petForm.size,
        age: petForm.age,
        ownerId: userId
      });

      console.log('Pet added with ID:', response.id);
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
            <Button onClick={() => loginWithRedirect()}>Log In</Button>
          </div>
        ) : (
          <main className="container py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

            <Tabs defaultValue="user" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">Your Profile</TabsTrigger>
                <TabsTrigger value="pet">Pet Profile</TabsTrigger>
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
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          required
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
                            onChange={(e) => setUserForm({ ...userForm, age: parseInt(e.target.value) })}
                        />
                      </div>
                      <Button type="submit">Save Changes</Button>
                      <Button
                        variant="secondary"
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        className="ml-4"
                      >
                        Log Out
                      </Button>
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
            </Tabs>
          </main>
        )}
      </div>
    </div>
  );
}
