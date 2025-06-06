
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, CreditCard, BadgePercent } from "lucide-react";
// import { formatIndianRupees } from "@/utils/emiUtils";

interface EMIDetails {
  isEmi: boolean;
  tenure: number;
  monthlyAmount: number;
  totalAmount: number;
  isHybrid: boolean;
  upfrontAmount: number;
}

const OrderComplete: React.FC = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string | null>(null);
  // const [emiDetails, setEmiDetails] = useState<EMIDetails | null>(null);

  useEffect(() => {
    const storedOrderId = sessionStorage.getItem("orderId");
    const storedOrderDate = sessionStorage.getItem("orderDate");
    // const storedEmiDetails = sessionStorage.getItem("emiDetails");
    
    if (!storedOrderId) {
      navigate("/");
      return;
    }
    
    setOrderId(storedOrderId);
    
    if (storedOrderDate) {
      const formattedDate = new Date(storedOrderDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setOrderDate(formattedDate);
    }
    
    // if (storedEmiDetails) {
    //   setEmiDetails(JSON.parse(storedEmiDetails));
    // }
  }, [navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm p-8 border text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">Order Date: {orderDate}</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">Order ID: {orderId}</span>
          </div>
          
          {/* {emiDetails && emiDetails.isEmi && (
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center mb-4">
                <BadgePercent className="h-5 w-5 text-brand-teal mr-2" />
                <span className="text-lg font-medium">EMI Payment Details</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="font-medium">{emiDetails.tenure} Months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Amount</p>
                  <p className="font-medium">{formatIndianRupees(emiDetails.monthlyAmount)}</p>
                </div>
                {emiDetails.isHybrid && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Upfront Payment</p>
                      <p className="font-medium">{formatIndianRupees(emiDetails.upfrontAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-medium">{formatIndianRupees(emiDetails.totalAmount)}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                EMI payments will be automatically charged to your card on the same date each month.
              </div>
            </div>
          )} */}
        </div>
        
        <Button onClick={() => navigate("/")} className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderComplete;
