import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <Link to="/create-event" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6 inline-block">
        Create New Event
      </Link>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="bg-white shadow-md rounded-lg p-4">
            <Link to={`/events/${event._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {event.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
