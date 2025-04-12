
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface HostedCheckoutProps {
  isProcessing: boolean;
  onSubmit: () => void;
}

const HostedCheckout: React.FC<HostedCheckoutProps> = ({ isProcessing, onSubmit }) => {
  return (
    <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
      <p className="text-sm text-gray-700 mb-4">
        You will be redirected to the secure Fiserv payment gateway to complete your payment. 
        Your order details will be securely transferred.
      </p>
      <div className="flex items-center text-gray-600 text-sm mb-4">
        <Lock className="h-4 w-4 mr-2 text-green-600" />
        <span>All payment information is encrypted and secure</span>
      </div>
      <div className="pt-4">
        <Button 
          type="button"
          onClick={onSubmit}
          className="w-full py-6 text-lg bg-brand-teal hover:bg-brand-teal/90"
          disabled={isProcessing}
        >
          {isProcessing ? "Redirecting to Payment Gateway..." : "Proceed to Secure Payment"}
        </Button>
      </div>
    </div>
  );
};

export default HostedCheckout;
