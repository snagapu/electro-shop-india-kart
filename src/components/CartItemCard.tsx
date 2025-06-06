
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/context/CartContext";

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, name, price, image, quantity } = item;

  // Format price in AED
  const formattedPrice = new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 3,
  }).format(price);

  const totalPrice = new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 3,
  }).format(price * quantity);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center p-4 border rounded-lg mb-4 bg-white">
      <div className="w-full md:w-1/5 mb-4 md:mb-0">
        <img
          src={image}
          alt={name}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>
      
      <div className="md:ml-4 w-full md:w-3/5">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-brand-teal font-bold">{formattedPrice}</p>
      </div>
      
      <div className="w-full md:w-1/5 flex flex-col items-start mt-4 md:mt-0 md:items-end">
        <p className="font-semibold text-lg mb-2">Total: {totalPrice}</p>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(id, quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="w-8 text-center">{quantity}</span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={() => removeFromCart(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
