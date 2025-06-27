// SetCountDown.jsx
"use client";
import React from "react";
import Countdown from "./CountDown";

function SetCountDown() {
  // Set the target date (Format: YYYY-MM-DDTHH:mm:ss)
<<<<<<< Updated upstream
  const targetDate = "2025-06-30T18:59:59";
=======
  const targetDate = "2026-01-01T00:00:00";
>>>>>>> Stashed changes

  return (
    <div className="App">
      <Countdown targetDate={targetDate} />
    </div>
  );
}

export default SetCountDown;
