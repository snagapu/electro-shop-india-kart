
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderComplete from "./pages/OrderComplete";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Component to handle redirects from payment gateway
const PaymentRedirectHandler = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const status = urlParams.get('status');
  
  useEffect(() => {
    if (status) {
      console.log("Detected payment redirect with status:", status);
    }
  }, [status]);
  
  if (status === 'success') {
    return <Navigate to="/order-complete" />;
  } else if (status === 'failed') {
    return <Navigate to="/payment?paymentFailed=true" />;
  }
  
  return <Payment />;
};

const App = () => {
  // Check if we have a payment redirect status in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  
  if (status) {
    console.log("App detected payment status:", status);
    if (status === 'success') {
      return (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Navigate to="/order-complete" />
            </CartProvider>
          </TooltipProvider>
        </QueryClientProvider>
      );
    } else if (status === 'failed') {
      return (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Navigate to="/payment?paymentFailed=true" />
            </CartProvider>
          </TooltipProvider>
        </QueryClientProvider>
      );
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-complete" element={<OrderComplete />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
