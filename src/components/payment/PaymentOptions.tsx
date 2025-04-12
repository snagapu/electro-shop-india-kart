
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink } from "lucide-react";

interface PaymentOptionsProps {
  useHostedCheckout: boolean;
  setUseHostedCheckout: (value: boolean) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  useHostedCheckout, 
  setUseHostedCheckout 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant={!useHostedCheckout ? "default" : "outline"}
          onClick={() => setUseHostedCheckout(false)}
          className="flex-1 mr-2"
        >
          <CreditCard className="mr-2" />
          Manual Entry
        </Button>
        <Button
          type="button"
          variant={useHostedCheckout ? "default" : "outline"}
          onClick={() => setUseHostedCheckout(true)}
          className="flex-1 ml-2"
        >
          <ExternalLink className="mr-2" />
          Fiserv Hosted Checkout
        </Button>
      </div>
    </div>
  );
};

export default PaymentOptions;
