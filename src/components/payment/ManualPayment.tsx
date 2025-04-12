
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CreditCard, Lock } from "lucide-react";
import { formatCardNumber, formatExpiryDate } from "@/utils/paymentUtils";

const formSchema = z.object({
  cardNumber: z.string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  cardName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  expiryDate: z.string()
    .regex(/^\d{2}\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string()
    .regex(/^\d{3}$/, { message: "CVV must be 3 digits" }),
});

export type ManualPaymentFormValues = z.infer<typeof formSchema>;

interface ManualPaymentProps {
  isProcessing: boolean;
  onSubmit: (values: ManualPaymentFormValues) => void;
}

const ManualPayment: React.FC<ManualPaymentProps> = ({ isProcessing, onSubmit }) => {
  const form = useForm<ManualPaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  return (
    <>
      <div className="flex items-center mb-4">
        <CreditCard className="h-6 w-6 mr-2 text-gray-500" />
        <h3 className="text-lg font-medium">Credit/Debit Card</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
    </>
  );
};

export default ManualPayment;
