// SetCountDown.jsx
"use client";
import React from "react";
import Countdown from "./CountDown";

function SetCountDown() {
  // Set the target date (Format: YYYY-MM-DDTHH:mm:ss)
  const targetDate = "2025-03-30T18:59:59";

  return (
    <div className="App">
      <Countdown targetDate={targetDate} />
    </div>
  );
}

export default SetCountDown;
