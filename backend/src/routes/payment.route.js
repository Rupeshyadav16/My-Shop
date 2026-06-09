import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, handleWebhook, createCodOrder } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);
router.post("/cod-order", protectRoute, createCodOrder);
router.post("/webhook", handleWebhook);

export default router;