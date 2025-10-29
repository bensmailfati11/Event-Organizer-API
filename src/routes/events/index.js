import express from "express";
import { eventService } from "#@/modules/events/index.js";
import { auth } from "#@/middlewares/auth.js";
import { isOrganizer } from "#@/middlewares/roles.js";

const router = express.Router();

// Public routes
router.get("/", async (req, res) => {
  try {
    const events = await eventService.getEvents({ status: "published" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the first published event (by date)
router.get("/first", async (req, res) => {
  try {
    const events = await eventService.getEvents({ status: "published" });
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No published events found" });
    }

    const first = events[0];
    // Return a clean structure
    res.json({
      id: first._id,
      title: first.title,
      description: first.description,
      date: first.date,
      location: first.location,
      capacity: first.capacity,
      attendeesCount: first.attendees ? first.attendees.length : 0,
      organizer: first.organizer,
      status: first.status,
      createdAt: first.createdAt,
      updatedAt: first.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Protected routes
router.use(auth);

// Organizer routes
router.post("/", isOrganizer, async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.userId);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", isOrganizer, async (req, res) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.user.userId,
      req.user.role,
      req.body
    );
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", isOrganizer, async (req, res) => {
  try {
    await eventService.deleteEvent(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Member routes
router.post("/:id/register", async (req, res) => {
  try {
    const event = await eventService.registerForEvent(
      req.params.id,
      req.user.userId
    );
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id/register", async (req, res) => {
  try {
    const event = await eventService.unregisterFromEvent(
      req.params.id,
      req.user.userId
    );
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
