import { Router } from "express";
import { getProducts, getProductById } from "../controllers/product.controller.js";

const router = Router();

// Sabhi users (bina login ke bhi) products dekh sakein
router.get("/", getProducts);

// Kisi ek specific product ko dekhne ke liye
router.get("/:id", getProductById);

export default router;