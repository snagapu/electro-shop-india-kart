
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { initiateHostedCheckout } from "@/services/PaymentService";
import PaymentPageLayout from "@/components/payment/PaymentPageLayout";
import PaymentOptions from "@/components/payment/PaymentOptions";
import HostedCheckout from "@/components/payment/HostedCheckout";
import ManualPayment, { ManualPaymentFormValues } from "@/components/payment/ManualPayment";
import { generateOrderId, calculateOrderTotals } from "@/utils/paymentUtils";

const Payment: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [useHostedCheckout, setUseHostedCheckout] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("userDetails") || items.length === 0) {
      navigate("/checkout");
    }
    
    const urlParams = new URLSearchParams(location.search);
    const paymentFailed = urlParams.get('paymentFailed');
    
    if (paymentFailed === 'true') {
      toast.error("Payment failed. Please try again.");
    }
  }, [location, items, navigate]);

  const userDetails = sessionStorage.getItem("userDetails");
  if (!userDetails || items.length === 0) {
    return null;
  }

  const parsedUserDetails = JSON.parse(userDetails);

  const handleHostedCheckoutSubmit = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log("Payment submission started, hosted checkout:", useHostedCheckout);
    
    const orderId = generateOrderId();
    sessionStorage.setItem("orderId", orderId);
    sessionStorage.setItem("orderDate", new Date().toISOString());
    
    const { orderTotal } = calculateOrderTotals(totalPrice);
    
    console.log("Initiating hosted checkout with:", {
      amount: orderTotal / 100,
      orderId: orderId,
      email: parsedUserDetails.email,
      name: parsedUserDetails.name
    });
    
    try {
      toast.info("Redirecting to payment gateway...");
      
      setTimeout(async () => {
        const success = await initiateHostedCheckout({
          amount: orderTotal / 100,
          currency: 'AED',
          orderId: orderId,
          customerEmail: parsedUserDetails.email,
          customerName: parsedUserDetails.name
        });
        
        if (!success) {
          setIsProcessing(false);
          toast.error("Failed to initiate payment. Please try again.");
        }
      }, 500);
    } catch (error) {
      console.error("Error in payment submission:", error);
      setIsProcessing(false);
      toast.error("An error occurred while processing your payment");
    }
  };

  const handleManualPaymentSubmit = (values: ManualPaymentFormValues) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log("Manual payment submission started with values:", values);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      const orderId = generateOrderId();
      
      sessionStorage.setItem("orderId", orderId);
      sessionStorage.setItem("orderDate", new Date().toISOString());
      
      clearCart();
      toast.success("Payment successful!");
      navigate("/order-complete");
    }, 2000);
  };

  return (
    <PaymentPageLayout>
      <div className="flex items-center mb-6">
        <Lock className="h-5 w-5 text-green-600 mr-2" />
        <h2 className="text-xl font-semibold">Secure Payment</h2>
      </div>
      
      <PaymentOptions 
        useHostedCheckout={useHostedCheckout} 
        setUseHostedCheckout={setUseHostedCheckout} 
      />
      
      {useHostedCheckout ? (
        <HostedCheckout 
          isProcessing={isProcessing} 
          onSubmit={handleHostedCheckoutSubmit} 
        />
      ) : (
        <ManualPayment 
          isProcessing={isProcessing} 
          onSubmit={handleManualPaymentSubmit} 
        />
      )}
    </PaymentPageLayout>
  );
};

export default Payment;
