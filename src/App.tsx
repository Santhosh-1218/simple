import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import LoveForm from "./pages/LoveForm";
import GiftForm from "./pages/GiftForm";
import LoveResult from "./pages/LoveResult";
import GiftResult from "./pages/GiftResult";
import ViewLove from "./pages/ViewLove";
import ViewGift from "./pages/ViewGift";
import NotFound from "./pages/NotFound";
import HeartSparkles from "@/components/HeartSparkles";

const queryClient = new QueryClient();

const App = () => {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HeartSparkles />
        {booting ? (
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm font-body text-muted-foreground">Loading love...</p>
            </div>
          </div>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/love" element={<LoveForm />} />
              <Route path="/gift" element={<GiftForm />} />
              <Route path="/love-result" element={<LoveResult />} />
              <Route path="/gift-result" element={<GiftResult />} />
              <Route path="/view/love" element={<ViewLove />} />
              <Route path="/view/gift" element={<ViewGift />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
