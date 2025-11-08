pimport "dotenv/config";
import express from "express";
import cors from "cors";
import { connectMongo } from "#@/databases/connect-mongo.js";
import apiRoutes from "#@/routes/index.js";

const app = express();
const port = process.env.PORT || 3001;

// -----------------------------
// Common middleware
// -----------------------------
app.use(cors()); // CORS for API consumers
app.use(express.json()); // JSON bodies for API
app.use(express.urlencoded({ extended: true })); // URL-encoded bodies for forms
// -----------------------------
// API routes under /api
// -----------------------------
app.use("/api", apiRoutes);
it 
// -----------------------------
// SSR pages (Handlebars)
// -----------------------------
// Home
app.get("/", (req, res) => {
  res.render("home", { title: "Event Organizer" });
});

// Events listing (published only)
app.get("/events", async (req, res) => {
  try {
    const { eventService } = await import("#@/modules/events/index.js");
    const events = await eventService.getEvents({ status: "published" });
    res.render("events", {
      title: "Events",
      events: events.map((e) => e.toObject()),
    });
  } catch (error) {
    res.status(500).render("error", { title: "Error", message: error.message });
  }
});

// Event details page
app.get("/events/:id/view", async (req, res) => {
  try {
    const { eventService } = await import("#@/modules/events/index.js");
    const event = await eventService.getEventById(req.params.id);
    res.render("event", { title: event.title, event: event.toObject() });
  } catch (error) {
    res
      .status(404)
      .render("error", { title: "Not Found", message: error.message });
  }
});

// Register + Login pages (SSR) with cookie-based session
app.get("/register", (req, res) => {
  if (req.user) return res.redirect("/member");
  res.render("register", { title: "Register" });
});

app.post("/register", async (req, res) => {
  try {
    const { authService } = await import("#@/modules/auth/index.js");
    const result = await authService.register(req.body);
    // auto-login after registration
    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("/member");
  } catch (error) {
    res
      .status(400)
      .render("register", { title: "Register", error: error.message });
  }
});

app.get("/login", (req, res) => {
  if (req.user) return res.redirect("/member");
  res.render("login", { title: "Login" });
});

app.post("/login", async (req, res) => {
  try {
    const { authService } = await import("#@/modules/auth/index.js");
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    // Set httpOnly cookie; SSR pages will pick it up and mirror to localStorage when needed
    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // enable behind HTTPS in production
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("/member");
  } catch (error) {
    res.status(401).render("login", { title: "Login", error: error.message });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Guard helpers for SSR pages
function requireUser(req, res, next) {
  if (!req.user) return res.redirect("/login");
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin")
    return res
      .status(403)
      .render("error", {
        title: "Access Denied",
        message: "Admin access required",
      });
  next();
}

// Member dashboard
app.get("/member", requireUser, async (req, res) => {
  try {
    const { eventService } = await import("#@/modules/events/index.js");
    const events = await eventService.getEvents({ status: "published" });
    const userEvents = await eventService.getEvents({
      attendees: req.user.userId,
    });
    res.render("member", {
      title: "Member Dashboard",
      events: events.map((e) => e.toObject()),
      userEvents: userEvents.map((e) => e.toObject()),
    });
  } catch (error) {
    res.status(500).render("error", { title: "Error", message: error.message });
  }
});

// Admin dashboard and create via form
app.get("/admin", requireUser, requireAdmin, async (req, res) => {
  try {
    const { eventService } = await import("#@/modules/events/index.js");
    const events = await eventService.getEvents({});
    res.render("admin", {
      title: "Admin Dashboard",
      events: events.map((e) => e.toObject()),
    });
  } catch (error) {
    res.status(500).render("error", { title: "Error", message: error.message });
  }
});

app.post("/admin/events", requireUser, requireAdmin, async (req, res) => {
  try {
    const { eventService } = await import("#@/modules/events/index.js");
    const { title, description, date, location, capacity, status } = req.body;
    await eventService.createEvent(
      {
        title,
        description,
        date: new Date(date),
        location,
        capacity: Number(capacity),
        status: status || "draft",
      },
      req.user.userId
    );
    res.redirect("/admin");
  } catch (error) {
    res.status(400).render("error", { title: "Error", message: error.message });
  }
});

// -----------------------------
// Error handling
// -----------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// -----------------------------
// Start server
// -----------------------------
async function startServer() {
  try {
    await connectMongo();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
