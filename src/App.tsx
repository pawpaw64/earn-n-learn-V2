
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Browse from "./pages/dashboard/Browse";
import Campus from "./pages/dashboard/Campus";
import Wallet from "./pages/dashboard/Wallet";
import Messages from "./pages/dashboard/Messages";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Calendar from "./pages/dashboard/Calendar";
import MyWork from "./pages/dashboard/MyWork";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="browse" element={<Browse />} />
          <Route path="campus" element={<Campus />} />
          <Route path="mywork" element={<MyWork />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
