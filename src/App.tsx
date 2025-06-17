
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import AudienceSelection from "./pages/AudienceSelection";
import Residential from "./pages/Residential";
import AirConditioners from "./pages/residential/AirConditioners";
import Commercial from "./pages/Commercial";
import Brands from "./pages/Brands";
import Learn from "./pages/Learn";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/audience" element={<AudienceSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/residential" element={<Residential />} />
          <Route path="/residential/air-conditioners" element={<AirConditioners />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
