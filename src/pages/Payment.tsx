
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OrderSummary from "@/components/OrderSummary";
import { useCart } from "@/context/CartContext";
import { CreditCard, Lock } from "lucide-react";

const formSchema = z.object({
  cardNumber: z.string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  cardName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  expiryDate: z.string()
    .regex(/^\d{2}\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string()
    .regex(/^\d{3}$/, { message: "CVV must be 3 digits" }),
});

type FormValues = z.infer<typeof formSchema>;

const Payment: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Check if user came from checkout
  const userDetails = sessionStorage.getItem("userDetails");
  if (!userDetails || items.length === 0) {
    navigate("/checkout");
    return null;
  }

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const onSubmit = (values: FormValues) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate order ID
      const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
      
      // Store order details for receipt
      sessionStorage.setItem("orderId", orderId);
      sessionStorage.setItem("orderDate", new Date().toISOString());
      
      // Clear cart and navigate to success page
      clearCart();
      toast.success("Payment successful!");
      navigate("/order-complete");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Payment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center mb-6">
              <Lock className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Secure Payment</h2>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 mr-2 text-gray-500" />
                  <h3 className="text-lg font-medium">Credit/Debit Card</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            e.target.value = formatted;
                            field.onChange(e.target.value.replace(/\s/g, ""));
                          }}
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            {...field} 
                            onChange={(e) => {
                              const formatted = formatExpiryDate(e.target.value);
                              e.target.value = formatted;
                              field.onChange(e.target.value);
                            }}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            {...field}
                            type="password" 
                            maxLength={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg bg-brand-teal hover:bg-brand-teal/90"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing Payment..." : "Pay & Complete Order"}
                  </Button>
                  <p className="text-xs text-center mt-4 text-gray-500">
                    <Lock className="h-3 w-3 inline-block mr-1" />
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="col-span-1">
          <OrderSummary showItems={true} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
