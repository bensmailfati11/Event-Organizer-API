import { Router } from "express";
import type { Request, Response } from "express";

import authRoutes from "./auth/index.ts";
import eventRoutes from "./events/index.ts";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Event Organizer API",
    endpoints: {
      auth: "/auth",
      events: "/events",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

export default router;
