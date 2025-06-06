
import React from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-lg p-8 md:p-12 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to Shri's ElectroShop
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Discover the latest in technology with our premium selection of electronic appliances at competitive prices.
          </p>
          <div className="bg-white/20 p-3 rounded-lg inline-block">
            <p className="text-sm font-semibold">Free shipping on orders over AED 5,000</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
