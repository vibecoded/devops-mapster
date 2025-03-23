
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a new query client
const queryClient = new QueryClient();

// Browser extension detection
const isExtension = window.location.protocol === 'chrome-extension:' || 
                    window.location.protocol === 'moz-extension:';

// Check for dark theme preference from extension storage if in extension context
const getExtensionTheme = async () => {
  if (typeof browser !== 'undefined' && browser.storage) {
    try {
      const data = await browser.storage.local.get('theme');
      return data.theme || 'light';
    } catch (error) {
      console.error('Failed to get theme from extension storage:', error);
      return 'light';
    }
  }
  return 'light';
};

const App = () => {
  // In extension mode, we use a simpler layout without browser router
  // since extensions have limited routing capabilities
  if (isExtension) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="extension-container">
              <Index />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
  
  // Standard web app layout
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
