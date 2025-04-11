
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-brand-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold">ElectroShop</Link>
        
        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium hover:text-brand-teal">
                  Home
                </Link>
                <Link to="/cart" className="text-lg font-medium hover:text-brand-teal">
                  Cart
                </Link>
                <Link to="/checkout" className="text-lg font-medium hover:text-brand-teal">
                  Checkout
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-brand-teal transition-colors duration-200">
            Home
          </Link>
          <Link to="/checkout" className="hover:text-brand-teal transition-colors duration-200">
            Checkout
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 hover:text-brand-teal transition-colors duration-200" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
