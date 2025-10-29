import { Event } from "../model/index.js";

export const eventService = {
  async createEvent(eventData, organizerId) {
    const event = new Event({
      ...eventData,
      organizer: organizerId,
    });
    return event.save();
  },

  async getEvents(query = {}) {
    return Event.find(query)
      .populate("organizer", "name email")
      .sort({ date: 1 });
  },

  async getEventById(eventId) {
    const event = await Event.findById(eventId)
      .populate("organizer", "name email")
      .populate("attendees", "name email");
    if (!event) throw new Error("Event not found");
    return event;
  },

  async updateEvent(eventId, userId, role, updateData) {
    if (role === "admin") {
      const event = await Event.findByIdAndUpdate(eventId, updateData, {
        new: true,
      });
      if (!event) throw new Error("Event not found");
      return event;
    }
    const event = await Event.findOneAndUpdate(
      { _id: eventId, organizer: userId },
      updateData,
      { new: true }
    );
    if (!event) throw new Error("Event not found or unauthorized");
    return event;
  },

  async deleteEvent(eventId, userId, role) {
    if (role === "admin") {
      const event = await Event.findByIdAndDelete(eventId);
      if (!event) throw new Error("Event not found");
      return event;
    }
    const event = await Event.findOneAndDelete({
      _id: eventId,
      organizer: userId,
    });
    if (!event) throw new Error("Event not found or unauthorized");
    return event;
  },

  async registerForEvent(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.attendees.includes(userId)) throw new Error("Already registered");
    if (event.attendees.length >= event.capacity)
      throw new Error("Event is full");

    event.attendees.push(userId);
    return event.save();
  },

  async unregisterFromEvent(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    const index = event.attendees.indexOf(userId);
    if (index === -1) throw new Error("Not registered for this event");

    event.attendees.splice(index, 1);
    return event.save();
  },
};
