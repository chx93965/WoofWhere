import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreatePlaydate from "./pages/CreatePlaydate";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";
// import ChatRoom from "./pages/ChatRoom";
import { SocketProvider } from "@/lib/socket";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-playdate" element={<CreatePlaydate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/chat" element={<ChatRoom />} /> */}
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;