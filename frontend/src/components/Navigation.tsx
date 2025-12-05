import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, User, Map, LogInIcon } from 'lucide-react';
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import path from 'path';

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/create-playdate', label: 'Schedule', icon: Calendar },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/profile', label: 'Profile', icon: User }, 
    { path: '/login', label: 'Login', icon: LogInIcon }
    // { path: '/chat', label: 'Chat', icon: MessageCircleMore },
  ];

  const handleLogout = () => {
    setUser(null);
    // localStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* <div className="text-2xl">🐕</div> */}
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            WoofWhere
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="font-mono font-bold text-lg text-amber-950">Hi, {user.name}</span>
              <span></span>
              <Button
                variant={'link'}
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant={'link'}
                  size="sm"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div> */}
      </div>
    </nav>
  );
};
