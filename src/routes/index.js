import { Router } from "express";

import authRoutes from "./auth/index.js";
import eventRoutes from "./events/index.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", {
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
