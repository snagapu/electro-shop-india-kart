
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Lock, CreditCard, BadgePercent } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { initiateHostedCheckout } from "@/services/PaymentService";
import PaymentPageLayout from "@/components/payment/PaymentPageLayout";
import PaymentOptions from "@/components/payment/PaymentOptions";
import HostedCheckout from "@/components/payment/HostedCheckout";
import ManualPayment, { ManualPaymentFormValues } from "@/components/payment/ManualPayment";
import { generateOrderId, calculateOrderTotals } from "@/utils/paymentUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import EMIOptions from "@/components/payment/EMIOptions";
import HybridPayment from "@/components/payment/HybridPayment";
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
    const { orderTotal } = calculateOrderTotals(totalPrice);
    const options = getEMIOptions(orderTotal / 100);
    setEmiOptions(options);
    if (options.length > 0 && !selectedTenure) {
      setSelectedTenure(options[0].tenure);
    }
    
    // Set default upfront amount to 10% of total
    const defaultUpfront = Math.round((orderTotal / 100) * 0.1);
    setUpfrontAmount(defaultUpfront);
  }, [totalPrice]);

  const userDetails = sessionStorage.getItem("userDetails");
  if (!userDetails || items.length === 0) {
    return null;
  }

  const parsedUserDetails = JSON.parse(userDetails);
  const { orderTotal } = calculateOrderTotals(totalPrice);
  
  const selectedEMIOption = emiOptions.find(option => option.tenure === selectedTenure);
  
  const getPaymentAmount = () => {
    if (paymentMode === "full") {
      return orderTotal / 100;
    } else if (useHybridPayment && selectedEMIOption) {
      return upfrontAmount;
    } else {
      return selectedEMIOption?.monthlyAmount || 0;
    }
  };

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
    
    // Store EMI selection details if applicable
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
    
    const paymentAmount = getPaymentAmount();
    
    console.log("Initiating hosted checkout with:", {
      amount: paymentAmount,
      orderId: orderId,
      email: parsedUserDetails.email,
      name: parsedUserDetails.name
    });
    
    try {
      toast.info("Redirecting to payment gateway...");
      
      setTimeout(async () => {
        const success = await initiateHostedCheckout({
          amount: paymentAmount,
          currency: 'INR',
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
    
    // Store EMI selection details if applicable
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
      
      <Tabs defaultValue="full" value={paymentMode} onValueChange={(value) => setPaymentMode(value as "full" | "emi")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full" className="text-base">
            <CreditCard className="h-4 w-4 mr-2" />
            Full Payment
          </TabsTrigger>
          <TabsTrigger value="emi" className="text-base">
            <BadgePercent className="h-4 w-4 mr-2" />
            EMI Options
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="full">
          <p className="text-sm text-gray-600 mb-4">
            Pay the full amount at once using your preferred payment method.
          </p>
        </TabsContent>
        
        <TabsContent value="emi" className="space-y-6">
          <EMIOptions 
            options={emiOptions} 
            selectedTenure={selectedTenure} 
            onSelectTenure={handleSelectTenure} 
          />
          
          <div className="flex items-center space-x-2">
            <Switch
              id="hybrid-payment"
              checked={useHybridPayment}
              onCheckedChange={setUseHybridPayment}
            />
            <Label htmlFor="hybrid-payment">Pay a portion upfront & rest as EMI</Label>
          </div>
          
          {useHybridPayment && selectedEMIOption && (
            <HybridPayment
              totalAmount={selectedEMIOption.totalAmount}
              upfrontAmount={upfrontAmount}
              onUpfrontAmountChange={handleUpfrontAmountChange}
            />
          )}
        </TabsContent>
      </Tabs>
      
      <PaymentOptions 
        useHostedCheckout={useHostedCheckout} 
        setUseHostedCheckout={setUseHostedCheckout} 
      />
      
      {useHostedCheckout ? (
        <div className="pt-4">
          <Button 
            onClick={handleHostedCheckoutSubmit}
            className="w-full py-6 text-lg bg-brand-teal hover:bg-brand-teal/90"
            disabled={isProcessing || (paymentMode === "emi" && !selectedTenure)}
          >
            {isProcessing ? "Processing Payment..." : `Pay & Complete Order`}
          </Button>
          <p className="text-xs text-center mt-2 text-gray-500">
            {paymentMode === "emi" && selectedEMIOption && (
              <>
                {useHybridPayment ? (
                  <>You'll pay ₹{upfrontAmount} now and ₹{selectedEMIOption.monthlyAmount} for {selectedEMIOption.tenure} months.</>
                ) : (
                  <>You'll pay ₹{selectedEMIOption.monthlyAmount} per month for {selectedEMIOption.tenure} months.</>
                )}
              </>
            )}
          </p>
        </div>
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
