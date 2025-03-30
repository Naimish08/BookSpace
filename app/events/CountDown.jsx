import React, { useState, useEffect } from 'react';

function Countdown({ targetDate }) {
  // State to store remaining time
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate total time left in hours, minutes, and seconds
  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return { totalHours: 0, minutes: 0, seconds: 0 };
    }

    // Total hours left including days
    const totalHours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { totalHours, minutes, seconds };
  }

  // useEffect to update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  // Format to add leading zeros
  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <div style={styles.container}>
      {timeLeft.totalHours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
        <h1 style={styles.expired}>⏰ Time's up!</h1>
      ) : (
        <h1 style={styles.timer}>
          {formatTime(timeLeft.totalHours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </h1>
      )}
    </div>
  );
}

// Basic styles for the component
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  timer: {
    fontSize: '48px',
    color: '#28a745',
  },
  expired: {
    fontSize: '36px',
    color: '#FF4C4C',
  },
};

export default Countdown;
