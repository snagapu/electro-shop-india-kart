
import React from "react";
import { CreditCard, BadgePercent } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMIOption } from "@/utils/emiUtils";
import EMIOptions from "./EMIOptions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import HybridPayment from "./HybridPayment";

interface PaymentModeTabsProps {
  paymentMode: "full" | "emi";
  onPaymentModeChange: (value: "full" | "emi") => void;
  emiOptions: EMIOption[];
  selectedTenure: number | null;
  onSelectTenure: (tenure: number) => void;
  useHybridPayment: boolean;
  onHybridPaymentChange: (value: boolean) => void;
  upfrontAmount: number;
  onUpfrontAmountChange: (amount: number) => void;
}

const PaymentModeTabs: React.FC<PaymentModeTabsProps> = ({
  paymentMode,
  onPaymentModeChange,
  emiOptions,
  selectedTenure,
  onSelectTenure,
  useHybridPayment,
  onHybridPaymentChange,
  upfrontAmount,
  onUpfrontAmountChange,
}) => {
  const selectedEMIOption = emiOptions.find(option => option.tenure === selectedTenure);

  return (
    <Tabs defaultValue="full" value={paymentMode} onValueChange={(value) => onPaymentModeChange(value as "full" | "emi")} className="mb-6">
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
          onSelectTenure={onSelectTenure} 
        />
        
        <div className="flex items-center space-x-2">
          <Switch
            id="hybrid-payment"
            checked={useHybridPayment}
            onCheckedChange={onHybridPaymentChange}
          />
          <Label htmlFor="hybrid-payment">Pay a portion upfront & rest as EMI</Label>
        </div>
        
        {useHybridPayment && selectedEMIOption && (
          <HybridPayment
            totalAmount={selectedEMIOption.totalAmount}
            upfrontAmount={upfrontAmount}
            onUpfrontAmountChange={onUpfrontAmountChange}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PaymentModeTabs;
