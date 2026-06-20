import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";
import { Product } from "../models/product.model.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export async function chatWithAI(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Kuch products context ke liye le aao
    const products = await Product.find().limit(20).select("name price category description");
    const productContext = products
      .map((p) => `${p.name} - ₹${p.price} (${p.category})`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tum "My Shop" e-commerce app ke liye ek friendly shopping assistant ho. 
Customer ki madad karo products dhundne, compare karne, ya recommendations dene mein.
Yahan kuch available products hain:
${productContext}

Customer ka sawaal: ${message}

Short, friendly, helpful jawaab do. Agar koi specific product available hai toh uska naam aur price batao. Hindi ya English jisme customer pooche usi mein jawaab do.`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
}