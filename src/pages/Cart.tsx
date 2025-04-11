
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CartItemCard from "@/components/CartItemCard";
import OrderSummary from "@/components/OrderSummary";

const Cart: React.FC = () => {
  const { items, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/">
            <Button className="bg-brand-teal hover:bg-brand-teal/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h1>
        <Button 
          variant="outline" 
          onClick={clearCart}
          className="text-red-500 border-red-500 hover:bg-red-50"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          {items.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>
        
        <div className="col-span-1">
          <OrderSummary showItems={true} />
          
          <div className="mt-6 space-y-4">
            <Link to="/checkout">
              <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-lg py-6">
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link to="/">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
