import React from "react";
import { useCart } from "@/context/CartContext";

interface OrderSummaryProps {
  showItems?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ showItems = false }) => {
  const { items, totalPrice } = useCart();
  
  // Calculate taxes (GST - 18% in India)
  const taxRate = 0.18;
  const taxes = totalPrice * taxRate;
  
  // Free shipping over AED 5000, otherwise AED 499
  const shippingThreshold = 5000;
  const shippingCost = totalPrice > shippingThreshold ? 0 : 499;
  
  // Total including taxes and shipping
  const orderTotal = totalPrice + taxes + shippingCost;
  
  // Format all prices in AED
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("ar-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      {showItems && items.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2 text-gray-700">Items</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t my-2"></div>
        </div>
      )}
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes (18% GST)</span>
          <span>{formatPrice(taxes)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shippingCost === 0 
              ? "Free" 
              : formatPrice(shippingCost)}
          </span>
        </div>
      </div>
      
      <div className="border-t pt-2">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
        {shippingCost === 0 && (
          <p className="text-green-600 text-sm mt-2">
            ✓ You qualify for free shipping
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
