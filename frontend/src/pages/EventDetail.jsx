import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-lg mb-4">{event.description}</p>
      <p className="text-gray-600 mb-2"><strong>Date:</strong> {event.date}</p>
      <p className="text-gray-600"><strong>Location:</strong> {event.location}</p>
    </div>
  );
};

export default EventDetail;
