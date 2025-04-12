
import React from "react";
import OrderSummary from "@/components/OrderSummary";

interface PaymentPageLayoutProps {
  children: React.ReactNode;
}

const PaymentPageLayout: React.FC<PaymentPageLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Payment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            {children}
          </div>
        </div>
        
        <div className="col-span-1">
          <OrderSummary showItems={true} />
        </div>
      </div>
    </div>
  );
};

export default PaymentPageLayout;
