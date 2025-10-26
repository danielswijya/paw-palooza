import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import OwnerOnboarding from "./pages/OwnerOnboarding";
import DogOnboarding from "./pages/DogOnboarding";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import DogProfile from "./pages/DogProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/owner-onboarding" element={<OwnerOnboarding />} />
          <Route path="/dog-onboarding" element={<DogOnboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dog/:id" element={<DogProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
