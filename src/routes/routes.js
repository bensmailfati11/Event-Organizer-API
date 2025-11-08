import { Router } from "express";
import jwt from "jsonwebtoken";
import { authService } from "#@/modules/auth/index.js";
import { eventService } from "#@/modules/events/index.js";
import { auth } from "#@/middlewares/auth.js";

const router = Router();

// Helper function to format dates
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to check if user is registered for event
function includes(array, item) {
  return array && array.includes(item);
}

// -----------------------------
// Web routes (Handlebars views)
// -----------------------------

// Home page
router.get("/", async (req, res) => {
  try {
    // Check if user is authenticated via session/cookie
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    let user = null;

    if (token) {
      try {
        // Verify token and get user info
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await authService.getUserById(decoded.userId);
      } catch (error) {
        // Invalid token, continue without user
      }
    }

    res.render("home", {
      title: "Home",
      user: user,
      helpers: { eq: (a, b) => a === b },
    });
  } catch (error) {
    res.render("home", {
      title: "Home",
      helpers: { eq: (a, b) => a === b },
    });
  }
});

// Auth pages
router.get("/auth/login", (req, res) => {
  res.render("auth", {
    title: "Login",
    activeTab: "login",
    helpers: { eq: (a, b) => a === b },
  });
});

router.get("/auth/register", (req, res) => {
  res.render("auth", {
    title: "Register",
    activeTab: "register",
    helpers: { eq: (a, b) => a === b },
  });
});

// Handle auth form submissions
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Set token in cookie for web session
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.redirect("/dashboard");
  } catch (error) {
    res.render("auth", {
      title: "Login",
      activeTab: "login",
      error: error.message,
      helpers: { eq: (a, b) => a === b },
    });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    await authService.register({ email, password, name, role });

    res.render("auth", {
      title: "Register",
      activeTab: "register",
      success: "Registration successful! Please login.",
      helpers: { eq: (a, b) => a === b },
    });
  } catch (error) {
    res.render("auth", {
      title: "Register",
      activeTab: "register",
      error: error.message,
      helpers: { eq: (a, b) => a === b },
    });
  }
});

router.get("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// Events page
router.get("/events", async (req, res) => {
  try {
    const events = await eventService.getEvents({ status: "published" });

    // Get user info for registration status
    const token = req.cookies?.token;
    let user = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await authService.getUserById(decoded.userId);
      } catch (error) {
        // Invalid token
      }
    }

    // Format events for display
    const formattedEvents = events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      attendeesCount: event.attendees ? event.attendees.length : 0,
      attendees: event.attendees || [],
      status: event.status,
    }));

    res.render("events", {
      title: "Events",
      events: formattedEvents,
      user: user,
      helpers: {
        eq: (a, b) => a === b,
        formatDate: formatDate,
        includes: includes,
      },
    });
  } catch (error) {
    res.render("events", {
      title: "Events",
      error: error.message,
      helpers: {
        eq: (a, b) => a === b,
        formatDate: formatDate,
        includes: includes,
      },
    });
  }
});

// Dashboard (protected)
router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);

    let myEvents = [];
    let registeredEvents = [];

    if (user.role === "organizer") {
      myEvents = await eventService.getEventsByOrganizer(req.user.userId);
      myEvents = myEvents.map((event) => ({
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        attendeesCount: event.attendees ? event.attendees.length : 0,
        status: event.status,
      }));
    }

    // Get events user is registered for
    const allEvents = await eventService.getEvents({ status: "published" });
    registeredEvents = allEvents
      .filter(
        (event) => event.attendees && event.attendees.includes(req.user.userId)
      )
      .map((event) => ({
        id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
      }));

    res.render("dashboard", {
      title: "Dashboard",
      user: user,
      myEvents: myEvents,
      registeredEvents: registeredEvents,
      helpers: {
        eq: (a, b) => a === b,
        formatDate: formatDate,
      },
    });
  } catch (error) {
    res.render("dashboard", {
      title: "Dashboard",
      user: req.user,
      error: error.message,
      helpers: {
        eq: (a, b) => a === b,
        formatDate: formatDate,
      },
    });
  }
});

// Backend info page
router.get("/backend-info", (req, res) => {
  res.render("backend-info", {
    title: "API Documentation",
  });
});

// Handle event registration/unregistration from web interface
router.post("/events/:id/register", auth, async (req, res) => {
  try {
    await eventService.registerForEvent(req.params.id, req.user.userId);
    res.redirect("/events");
  } catch (error) {
    res.redirect("/events?error=" + encodeURIComponent(error.message));
  }
});

// Method override for DELETE from forms
router.delete("/events/:id/register", auth, async (req, res) => {
  try {
    await eventService.unregisterFromEvent(req.params.id, req.user.userId);
    res.redirect("/events");
  } catch (error) {
    res.redirect("/events?error=" + encodeURIComponent(error.message));
  }
});

// Create event (organizers only)
router.post("/events", auth, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    if (user.role !== "organizer") {
      return res
        .status(403)
        .redirect("/dashboard?error=Only organizers can create events");
    }

    await eventService.createEvent(req.body, req.user.userId);
    res.redirect("/dashboard");
  } catch (error) {
    res.redirect("/dashboard?error=" + encodeURIComponent(error.message));
  }
});

export default router;
