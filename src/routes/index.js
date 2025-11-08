import { Router } from "express";
import { auth } from "#@/middlewares/auth.js";
import { authService } from "#@/modules/auth/index.js";

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

// Web auth routes
router.get("/login", (req, res) => {
  res.render("auth", {
    title: "Login",
    layout: "main",
    showLoginForm: true,
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    // Set token in cookie for web session
    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); // 24h
    res.redirect("/dashboard");
  } catch (error) {
    res.render("auth", {
      title: "Login",
      layout: "main",
      showLoginForm: true,
      error: error.message,
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.get("/dashboard", auth, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    layout: "main",
    user: req.user,
  });
});

router.get("/backend-info", (req, res) => {
  res.render("backend-info", {
    title: "Backend Info",
    layout: "main",
  });
});

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

export default router;
