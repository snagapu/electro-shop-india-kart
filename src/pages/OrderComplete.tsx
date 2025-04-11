
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home } from "lucide-react";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

const OrderComplete: React.FC = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    // Get order details from session storage
    const storedOrderId = sessionStorage.getItem("orderId");
    const storedOrderDate = sessionStorage.getItem("orderDate");
    const storedUserDetails = sessionStorage.getItem("userDetails");
    const storedCart = sessionStorage.getItem("cart");
    
    if (!storedOrderId || !storedOrderDate || !storedUserDetails) {
      navigate("/");
      return;
    }
    
    setOrderId(storedOrderId);
    setOrderDate(storedOrderDate);
    setUserDetails(JSON.parse(storedUserDetails));
    
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, [navigate]);
  
  if (!orderId || !orderDate || !userDetails) {
    return null;
  }
  
  // Format order date
  const formattedDate = new Date(orderDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 5000 ? 0 : 499;
  const orderTotal = subtotal + taxes + shipping;
  
  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Simulate downloading receipt
  const downloadReceipt = () => {
    // In a real app, this would generate a PDF or call an API
    alert("Receipt download functionality would be implemented here");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 border">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Order Number</h3>
            <p className="font-semibold">{orderId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
            <p>{formattedDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
            <p>{userDetails.name}</p>
            <p>{userDetails.email}</p>
            <p>{userDetails.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
            <p>{userDetails.address}</p>
            <p>{userDetails.city}, {userDetails.pincode}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="py-3 px-4 text-sm font-semibold">Product</th>
                  <th className="py-3 px-4 text-sm font-semibold">Quantity</th>
                  <th className="py-3 px-4 text-sm font-semibold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-8 border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Taxes (18% GST)</span>
            <span>{formatPrice(taxes)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={downloadReceipt} className="bg-brand-teal hover:bg-brand-teal/90">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
          <Link to="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
