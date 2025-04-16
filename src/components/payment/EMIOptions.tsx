
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info, BadgeIndianRupee } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EMIOption, formatIndianRupees } from "@/utils/emiUtils";

interface EMIOptionsProps {
  options: EMIOption[];
  selectedTenure: number | null;
  onSelectTenure: (tenure: number) => void;
}

const EMIOptions: React.FC<EMIOptionsProps> = ({
  options,
  selectedTenure,
  onSelectTenure,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-medium">Select EMI Tenure</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 ml-2 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Choose an EMI tenure that suits your budget. Longer tenures have smaller monthly payments but higher total interest.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <RadioGroup
        value={selectedTenure?.toString() || ""}
        onValueChange={(value) => onSelectTenure(parseInt(value))}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.tenure}
            className={`border rounded-lg p-4 transition-all ${
              selectedTenure === option.tenure
                ? "border-brand-teal bg-brand-teal/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start">
              <RadioGroupItem
                value={option.tenure.toString()}
                id={`tenure-${option.tenure}`}
                className="mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`tenure-${option.tenure}`}
                    className="text-base font-medium"
                  >
                    {option.tenure} {option.tenure === 1 ? "Month" : "Months"}
                  </Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Interest:</span>
                    <Badge variant="outline" className="font-medium">
                      {option.interestRate}% p.a.
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="text-base font-semibold flex items-center">
                      <BadgeIndianRupee className="h-4 w-4 mr-1" />
                      {formatIndianRupees(option.monthlyAmount)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Interest</p>
                    <p className="text-base flex items-center">
                      <BadgeIndianRupee className="h-4 w-4 mr-1" />
                      {formatIndianRupees(option.totalInterest)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-base flex items-center">
                      <BadgeIndianRupee className="h-4 w-4 mr-1" />
                      {formatIndianRupees(option.totalAmount)}
                    </p>
                  </div>
                </div>
                
                {option.cashbackAmount && option.cashbackAmount > 0 && (
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                      ₹{option.cashbackAmount} Cashback
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default EMIOptions;
