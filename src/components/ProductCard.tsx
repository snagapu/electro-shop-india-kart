
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { name, price, image, description } = product;

  // Format price in AED
  const formattedPrice = new Intl.NumberFormat("ar-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative pt-[60%] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="py-4 flex-grow">
        <CardTitle className="line-clamp-1 text-lg font-semibold mb-2">{name}</CardTitle>
        <p className="text-2xl font-bold text-brand-teal mb-2">{formattedPrice}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full bg-brand-orange hover:bg-brand-orange/90"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
