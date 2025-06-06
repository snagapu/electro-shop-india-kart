
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium 4K Smart TV",
    price: 45999,
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=800&auto=format&fit=crop",
    description: "Experience stunning clarity with this 55-inch 4K Ultra HD Smart LED TV featuring HDR technology and built-in streaming apps.",
    category: "Television"
  },
  {
    id: 2,
    name: "Professional DSLR Camera",
    price: 65499,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    description: "Capture life's moments with exceptional detail using this 24.2MP DSLR camera with 4K video recording and Wi-Fi connectivity.",
    category: "Camera"
  },
  {
    id: 3,
    name: "Performance Gaming Laptop",
    price: 89999,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
    description: "Dominate your games with this high-performance laptop featuring an RTX graphics card, 16GB RAM, and a 144Hz display.",
    category: "Computer"
  },
  {
    id: 4,
    name: "Wireless Noise-Cancelling Headphones",
    price: 15999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    description: "Immerse yourself in your favorite music with these premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
    category: "Audio"
  },
  {
    id: 5,
    name: "Smart Home Security System",
    price: 12999,
    image: "https://images.unsplash.com/photo-1558002038-1055e2cfae43?q=80&w=800&auto=format&fit=crop",
    description: "Protect your home with this comprehensive security system including HD cameras, motion sensors, and smartphone integration.",
    category: "Security"
  },
  {
    id: 6,
    name: "Ultra-Thin Smartphone",
    price: 54999,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop",
    description: "Stay connected with this flagship smartphone featuring a stunning AMOLED display, advanced camera system, and all-day battery life.",
    category: "Mobile"
  },
  {
    id: 7,
    name: "Smart Fitness Watch",
    price: 9999,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and water resistance up to 50 meters.",
    category: "Wearable"
  },
  {
    id: 8,
    name: "LG Inverter Air Conditioner",
    price: 54990,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
    description: "Enjoy cool air conditioning for hot summer weather.",
    category: "Home Improvements"
  }
];
