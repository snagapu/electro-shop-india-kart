
import React from "react";
import { Button } from "@/components/ui/button";
import { EMIOption } from "@/utils/emiUtils";
import ManualPayment, { ManualPaymentFormValues } from "./ManualPayment";

interface PaymentActionsProps {
  useHostedCheckout: boolean;
  isProcessing: boolean;
  paymentMode: "full" | "emi";
  selectedEMIOption?: EMIOption;
  useHybridPayment: boolean;
  upfrontAmount: number;
  onHostedCheckoutSubmit: () => void;
  onManualPaymentSubmit: (values: ManualPaymentFormValues) => void;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  useHostedCheckout,
  isProcessing,
  paymentMode,
  selectedEMIOption,
  useHybridPayment,
  upfrontAmount,
  onHostedCheckoutSubmit,
  onManualPaymentSubmit,
}) => {
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentButtonText = () => {
    if (isProcessing) {
      return "Processing Payment...";
    }
    
    if (paymentMode === "full") {
      return "Pay & Complete Order";
    }
    
    if (useHybridPayment && selectedEMIOption) {
      return `Pay ${formatAmount(upfrontAmount)} Now`;
    }
    
    if (selectedEMIOption) {
      return `Pay First EMI of ${formatAmount(selectedEMIOption.monthlyAmount)}`;
    }
    
    return "Pay & Complete Order";
  };

  return useHostedCheckout ? (
    <div className="pt-4">
      <Button 
        onClick={onHostedCheckoutSubmit}
        className="w-full py-6 text-lg bg-brand-teal hover:bg-brand-teal/90"
        disabled={isProcessing || (paymentMode === "emi" && !selectedEMIOption)}
      >
        {getPaymentButtonText()}
      </Button>
      <p className="text-xs text-center mt-2 text-gray-500">
        {paymentMode === "emi" && selectedEMIOption && (
          <>
            {useHybridPayment ? (
              <>You'll pay {formatAmount(upfrontAmount)} now and {formatAmount(selectedEMIOption.monthlyAmount)} for {selectedEMIOption.tenure} months.</>
            ) : (
              <>You'll pay {formatAmount(selectedEMIOption.monthlyAmount)} per month for {selectedEMIOption.tenure} months.</>
            )}
          </>
        )}
      </p>
    </div>
  ) : (
    <ManualPayment 
      isProcessing={isProcessing} 
      onSubmit={onManualPaymentSubmit} 
    />
  );
};

export default PaymentActions;
