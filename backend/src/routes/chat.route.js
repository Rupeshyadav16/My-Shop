import { Router } from "express";
import { chatWithAI } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protectRoute, chatWithAI);

export default router;