import { Router } from "express";

import authRoutes from "./auth/index.js";
import eventRoutes from "./events/index.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    layout: "main",
  });
});

router.get("/auth", (req, res) => {
  res.render("auth", {
    title: "Authentication",
    layout: "main",
  });
});

router.get("/events", (req, res) => {
  res.render("events", {
    title: "Events",
    layout: "main",
  });
});

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

export default router;
