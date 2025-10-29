import { Router } from "express";

import authRoutes from "./auth/index.js";
import eventRoutes from "./events/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

export default router;
