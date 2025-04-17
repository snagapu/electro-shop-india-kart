import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { initiateHostedCheckout } from "@/services/PaymentService";
import PaymentPageLayout from "@/components/payment/PaymentPageLayout";
import PaymentOptions from "@/components/payment/PaymentOptions";
import PaymentModeTabs from "@/components/payment/PaymentModeTabs";
import PaymentActions from "@/components/payment/PaymentActions";
import { ManualPaymentFormValues } from "@/components/payment/ManualPayment";
import { generateOrderId, calculateOrderTotals } from "@/utils/paymentUtils";
import { getEMIOptions, EMIOption } from "@/utils/emiUtils";

const Payment: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [useHostedCheckout, setUseHostedCheckout] = useState(true);
  const [paymentMode, setPaymentMode] = useState<"full" | "emi">("full");
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);
  const [useHybridPayment, setUseHybridPayment] = useState(false);
  const [upfrontAmount, setUpfrontAmount] = useState(0);
  const [emiOptions, setEmiOptions] = useState<EMIOption[]>([]);
  
  const { orderTotal } = calculateOrderTotals(totalPrice);

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

  useEffect(() => {
    const options = getEMIOptions(totalPrice / 100);
    setEmiOptions(options);
    if (options.length > 0 && !selectedTenure) {
      setSelectedTenure(options[0].tenure);
    }
    
    const defaultUpfront = Math.round((totalPrice / 100) * 0.1);
    setUpfrontAmount(defaultUpfront);
  }, [totalPrice]);

  const userDetails = sessionStorage.getItem("userDetails");
  if (!userDetails || items.length === 0) {
    return null;
  }

  const parsedUserDetails = JSON.parse(userDetails);
  const selectedEMIOption = emiOptions.find(option => option.tenure === selectedTenure);

  const handleSelectTenure = (tenure: number) => {
    setSelectedTenure(tenure);
  };

  const handleUpfrontAmountChange = (amount: number) => {
    setUpfrontAmount(amount);
  };

  const handleHostedCheckoutSubmit = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log("Payment submission started, hosted checkout:", useHostedCheckout);
    
    const orderId = generateOrderId();
    sessionStorage.setItem("orderId", orderId);
    sessionStorage.setItem("orderDate", new Date().toISOString());
    
    if (paymentMode === "emi") {
      const emiDetails = {
        isEmi: true,
        tenure: selectedTenure,
        monthlyAmount: selectedEMIOption?.monthlyAmount || 0,
        totalAmount: selectedEMIOption?.totalAmount || 0,
        isHybrid: useHybridPayment,
        upfrontAmount: useHybridPayment ? upfrontAmount : 0
      };
      sessionStorage.setItem("emiDetails", JSON.stringify(emiDetails));
    }
    
    const paymentAmount = orderTotal / 100;
    
    try {
      toast.info("Redirecting to payment gateway...");
      console.log("Payment amount being sent:", paymentAmount);
      
      setTimeout(async () => {
        const success = await initiateHostedCheckout({
          amount: paymentAmount,
          currency: 'INR',
          orderId: orderId,
          customerEmail: parsedUserDetails.email,
          customerName: parsedUserDetails.name,
          isEmi: paymentMode === "emi",
          emiTenure: selectedTenure || 0,
          isHybridPayment: useHybridPayment && paymentMode === "emi",
          upfrontAmount: useHybridPayment ? upfrontAmount : 0
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
    
    if (paymentMode === "emi") {
      const emiDetails = {
        isEmi: true,
        tenure: selectedTenure,
        monthlyAmount: selectedEMIOption?.monthlyAmount || 0,
        totalAmount: selectedEMIOption?.totalAmount || 0,
        isHybrid: useHybridPayment,
        upfrontAmount: useHybridPayment ? upfrontAmount : 0
      };
      sessionStorage.setItem("emiDetails", JSON.stringify(emiDetails));
    }
    
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
      
      <PaymentModeTabs 
        paymentMode={paymentMode}
        onPaymentModeChange={setPaymentMode}
        emiOptions={emiOptions}
        selectedTenure={selectedTenure}
        onSelectTenure={handleSelectTenure}
        useHybridPayment={useHybridPayment}
        onHybridPaymentChange={setUseHybridPayment}
        upfrontAmount={upfrontAmount}
        onUpfrontAmountChange={handleUpfrontAmountChange}
      />
      
      <PaymentOptions 
        useHostedCheckout={useHostedCheckout} 
        setUseHostedCheckout={setUseHostedCheckout} 
      />
      
      <PaymentActions 
        useHostedCheckout={useHostedCheckout}
        isProcessing={isProcessing}
        paymentMode={paymentMode}
        selectedEMIOption={selectedEMIOption}
        useHybridPayment={useHybridPayment}
        upfrontAmount={upfrontAmount}
        onHostedCheckoutSubmit={handleHostedCheckoutSubmit}
        onManualPaymentSubmit={handleManualPaymentSubmit}
      />
    </PaymentPageLayout>
  );
};

export default Payment;
