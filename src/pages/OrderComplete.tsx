
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, CreditCard, BadgePercent } from "lucide-react";

interface EMIDetails {
  isEmi: boolean;
  tenure: number;
  monthlyAmount: number;
  totalAmount: number;
  isHybrid: boolean;
  upfrontAmount: number;
}

const OrderComplete: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params first (from payment gateway redirect)
    const urlOrderId = searchParams.get('orderId');
    const urlStatus = searchParams.get('status');
    
    console.log("OrderComplete - URL params:", { urlOrderId, urlStatus });
    
    // Check session storage
    const storedOrderId = sessionStorage.getItem("orderId");
    const storedOrderDate = sessionStorage.getItem("orderDate");
    
    console.log("OrderComplete - Session storage:", { storedOrderId, storedOrderDate });
    
    // Use URL order ID if available, otherwise use stored order ID
    const finalOrderId = urlOrderId || storedOrderId;
    
    if (!finalOrderId) {
      console.log("No order ID found, redirecting to home");
      navigate("/");
      return;
    }
    
    setOrderId(finalOrderId);
    
    // If we got order ID from URL but not in session, store it
    if (urlOrderId && !storedOrderId) {
      sessionStorage.setItem("orderId", urlOrderId);
    }
    
    if (storedOrderDate) {
      const formattedDate = new Date(storedOrderDate).toLocaleDateString("en-AE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setOrderDate(formattedDate);
    } else {
      // If no stored date, use current date
      const currentDate = new Date().toLocaleDateString("en-AE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setOrderDate(currentDate);
      sessionStorage.setItem("orderDate", new Date().toISOString());
    }
  }, [navigate, searchParams]);

  // Show loading state while checking for order ID
  if (orderId === null) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8 border text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm p-8 border text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">Order Date: {orderDate}</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">Order ID: {orderId}</span>
          </div>
        </div>
        
        <Button onClick={() => navigate("/")} className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderComplete;
