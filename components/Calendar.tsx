// components/CalendarEmbed.tsx
import React from 'react';

const CalendarEmbed: React.FC = () => {
  return (
    <div className="flex justify-center">
      <iframe
        src="https://calendar.google.com/calendar/embed?src=bookspaceconnect%40gmail.com&ctz=Asia%2FKolkata"
        style={{ border: 0 }}
        width="100%"
        height="900"
        frameBorder="0"
        scrolling="no"
        title="Google Calendar"
      ></iframe>
    </div>
  );
};

export default CalendarEmbed;
