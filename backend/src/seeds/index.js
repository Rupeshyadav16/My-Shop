import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ENV } from "../config/env.js";

// MOBILE ACCESSORIES - Competitive Market Prices in INR
const products = [
  // PHONE CASES
  {
    name: "Premium Silicone Phone Case",
    description:
      "Soft silicone case with anti-slip grip. Shock-absorbing design protects your phone from drops and scratches. Available in multiple colors.",
    price: 399,
    stock: 150,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
      "https://images.unsplash.com/photo-1592286927505-1def25e85061?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 234,
  },
  {
    name: "Leather Flip Case - Premium",
    description:
      "Genuine leather flip case with card slots. Elegant design suitable for office and casual use. Protects screen and back.",
    price: 699,
    stock: 85,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 189,
  },
  {
    name: "Crystal Clear TPU Case",
    description:
      "Transparent TPU case that shows off your phone's design. Provides excellent protection against daily wear and tear. Yellowing resistant.",
    price: 299,
    stock: 200,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
      "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 312,
  },

  // SCREEN PROTECTORS
  {
    name: "Tempered Glass Screen Protector",
    description:
      "Premium 9H hardness tempered glass. Anti-fingerprint coating, easy installation, and bubble-free application.",
    price: 199,
    stock: 300,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500",
      "https://images.unsplash.com/photo-1516762714899-abc6ba688908?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 567,
  },
  {
    name: "Matte Privacy Screen Protector",
    description:
      "Privacy screen protector with matte finish. Reduces glare and protects against screen scratches. Anti-spy technology.",
    price: 349,
    stock: 120,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500",
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 198,
  },

  // CHARGERS & CABLES
  {
    name: "Fast Charge USB-C Cable",
    description:
      "High-speed USB-C cable supporting 65W fast charging. Durable nylon braided design with 2-year warranty. Length: 1.5m",
    price: 299,
    stock: 250,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 423,
  },
  {
    name: "20W USB-C Wall Charger",
    description:
      "Compact 20W USB-C power adapter. Fast charging for iPhones and Android devices. Foldable plug design for travel.",
    price: 599,
    stock: 180,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1571290437329-6a9d2eae867e?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 289,
  },
  {
    name: "65W Multi-Port Charger",
    description:
      "Multi-port USB-C and USB-A charger. Charge up to 3 devices simultaneously. Perfect for offices and travel.",
    price: 1299,
    stock: 90,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 234,
  },

  // POWER BANKS
  {
    name: "10000mAh Power Bank",
    description:
      "Compact 10000mAh power bank with dual USB ports. Fast charging support. LED display shows battery percentage.",
    price: 899,
    stock: 150,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1616348436168-de43ad517551?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 345,
  },
  {
    name: "20000mAh Power Bank with LED",
    description:
      "High-capacity 20000mAh power bank with three USB ports and USB-C input. LED torch and display. Perfect for long trips.",
    price: 1299,
    stock: 120,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1616348436168-de43ad517551?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 267,
  },
  {
    name: "30000mAh Solar Power Bank",
    description:
      "Extra large 30000mAh power bank with solar charging. Waterproof and shockproof design. Perfect for outdoor adventures.",
    price: 1999,
    stock: 75,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1616348436168-de43ad517551?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 156,
  },

  // PHONE STANDS
  {
    name: "Adjustable Phone Stand",
    description:
      "Aluminum alloy adjustable phone stand. Fits all phones 4-7 inches. Non-slip base with 360-degree rotation.",
    price: 299,
    stock: 200,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1605559827260-b0fa9239c3c4?w=500",
      "https://images.unsplash.com/photo-1611532936579-6b16e2b50449?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 289,
  },
  {
    name: "Desktop Phone Stand Pro",
    description:
      "Premium stainless steel phone stand. Supports landscape and portrait modes. Perfect for video calls and streaming.",
    price: 599,
    stock: 110,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1605559827260-b0fa9239c3c4?w=500",
      "https://images.unsplash.com/photo-1611532936579-6b16e2b50449?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 198,
  },

  // SCREEN CLEANERS
  {
    name: "Phone Screen Cleaning Kit",
    description:
      "Complete cleaning kit with microfiber cloth, cleaning solution, and brush. Safe for all phone screens and glasses.",
    price: 149,
    stock: 400,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1611532936579-6b16e2b50449?w=500",
      "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500",
    ],
    averageRating: 4.3,
    totalReviews: 234,
  },
  {
    name: "Microfiber Cleaning Cloth Pack",
    description:
      "Pack of 5 premium microfiber cloths. Perfect for cleaning phone screens, cameras, and lenses without scratching.",
    price: 199,
    stock: 350,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1611532936579-6b16e2b50449?w=500",
      "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 167,
  },

  // PHONE RINGS & GRIPS
  {
    name: "Phone Ring Holder Stand",
    description:
      "Luxury metal phone ring with kickstand. 360-degree rotation. Works with all phones and cases.",
    price: 249,
    stock: 300,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609040625556-49953800ba65?w=500",
      "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 312,
  },
  {
    name: "Silicone Phone Grip",
    description:
      "Elastic silicone phone grip for secure hold. Prevents accidental drops. Available in multiple colors.",
    price: 99,
    stock: 500,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609040625556-49953800ba65?w=500",
      "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500",
    ],
    averageRating: 4.2,
    totalReviews: 421,
  },

  // HEADPHONES & EARBUDS
  {
    name: "Wireless Bluetooth Earbuds",
    description:
      "True wireless earbuds with active noise cancellation, 6-hour battery life, and charging case. Crystal clear sound quality.",
    price: 1199,
    stock: 100,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 456,
  },
  {
    name: "Budget Wireless Earbuds",
    description:
      "Affordable wireless earbuds with 5-hour battery. Waterproof design and comfortable fit. Great for daily use.",
    price: 599,
    stock: 150,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 234,
  },

  // CABLES
  {
    name: "Lightning Cable Pack (3)",
    description:
      "Pack of 3 certified Lightning cables for iPhones. 1m length. Durable nylon braided design with 18-month warranty.",
    price: 399,
    stock: 200,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 289,
  },
  {
    name: "Micro USB Cable Pack (5)",
    description:
      "Bundle of 5 Micro USB cables for Android devices. 1m length each. Reliable connection and fast charging.",
    price: 299,
    stock: 250,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1609042231695-fdd6b3cea5ff?w=500",
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 198,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert seed products
    await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${products.length} products`);

    // Display summary
    const categories = [...new Set(products.map((p) => p.category))];
    console.log("\n📊 Seeded Products Summary:");
    console.log(`Total Products: ${products.length}`);
    console.log(`Categories: ${categories.join(", ")}`);

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database seeding completed and connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
