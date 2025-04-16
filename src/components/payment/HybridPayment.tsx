
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatIndianRupees, calculateRemainingPrincipal } from "@/utils/emiUtils";

interface HybridPaymentProps {
  totalAmount: number;
  upfrontAmount: number;
  onUpfrontAmountChange: (amount: number) => void;
}

const HybridPayment: React.FC<HybridPaymentProps> = ({
  totalAmount,
  upfrontAmount,
  onUpfrontAmountChange,
}) => {
  const minUpfront = Math.min(5000, totalAmount * 0.1);
  const maxUpfront = totalAmount * 0.9;
  const [localAmount, setLocalAmount] = useState(upfrontAmount.toString());
  
  useEffect(() => {
    setLocalAmount(upfrontAmount.toString());
  }, [upfrontAmount]);

  const handleSliderChange = (value: number[]) => {
    const newUpfront = value[0];
    onUpfrontAmountChange(newUpfront);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setLocalAmount(value);
    
    const numValue = parseInt(value) || 0;
    if (numValue >= minUpfront && numValue <= maxUpfront) {
      onUpfrontAmountChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(localAmount) || 0;
    
    if (numValue < minUpfront) {
      onUpfrontAmountChange(minUpfront);
    } else if (numValue > maxUpfront) {
      onUpfrontAmountChange(maxUpfront);
    } else {
      onUpfrontAmountChange(numValue);
    }
  };

  const remainingAmount = calculateRemainingPrincipal(totalAmount, upfrontAmount);
  const upfrontPercentage = Math.round((upfrontAmount / totalAmount) * 100);

  return (
    <div className="space-y-6 mt-4">
      <div>
        <Label htmlFor="upfront-amount" className="text-base font-medium">
          Pay Upfront Amount
        </Label>
        <div className="mt-2">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Slider
                defaultValue={[upfrontAmount]}
                min={minUpfront}
                max={maxUpfront}
                step={100}
                value={[upfrontAmount]}
                onValueChange={handleSliderChange}
                className="mt-2"
              />
            </div>
            <div className="w-24">
              <Input
                id="upfront-amount"
                type="text"
                value={localAmount}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="text-right"
              />
            </div>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>{formatIndianRupees(minUpfront)}</span>
            <span>{formatIndianRupees(maxUpfront)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Upfront Payment</p>
            <p className="text-lg font-medium">
              {formatIndianRupees(upfrontAmount)} ({upfrontPercentage}%)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining Amount for EMI</p>
            <p className="text-lg font-medium">{formatIndianRupees(remainingAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HybridPayment;
