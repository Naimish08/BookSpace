"use client";

import React, { useEffect, useState } from "react";

interface ApiEvent {
  id: string;
  event_name: string;
  description: string;
  venue: string;
  time: string;
  image: string;
  blog_link: string;
  _count?: { participants: number };
}

const CalendarEmbed: React.FC = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        if (!active) return;
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-[#462C90]">Loading events...</div>;
  }

  if (events.length === 0) {
    return <div className="text-center p-8 text-[#462C90]">No upcoming events at the moment. Check back later!</div>;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {events.map((event) => {
        const eventDate = new Date(event.time);
        return (
          <div key={event.id} className="bg-white rounded-xl shadow-lg border border-[#E1B5EE] overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#462C90] text-white p-4">
              <h3 className="font-bold text-xl mb-1 line-clamp-1">{event.event_name}</h3>
              <p className="text-[#E1B5EE] text-sm flex justify-between items-center">
                <span>{eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>{eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-[#241943] font-medium mb-3">
                <span className="text-[#9d5583]">📍 Venue:</span>
                <span className="line-clamp-1">{event.venue}</span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                {event.description}
              </p>
              
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="bg-[#f0befd] text-[#462C90] px-3 py-1 rounded-full font-semibold">
                  {event._count?.participants || 0} Attending
                </span>
                
                {event.blog_link && (
                  <a href={event.blog_link} target="_blank" rel="noreferrer" className="text-[#462C90] hover:underline font-medium">
                    Read More →
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarEmbed;
