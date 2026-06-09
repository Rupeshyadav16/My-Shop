import { Product } from "../models/product.model.js";

// 1. Sabhi products ko fetch karne ke liye (All Products)
export async function getProducts(req, res) {
  try {
    // MongoDB se saare products retrieve karega
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    // Agar mobile app directly array expect karta hai:
    res.status(200).json(products);
    
    // NOTE: Agar aapka mobile app response me data.products dhundh raha hai, 
    // to upar wali line ko comment karke niche wali line use karein:
    // res.status(200).json({ success: true, products });
    
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// 2. Kisi ek product ko ID se fetch karne ke liye (Single Product)
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}