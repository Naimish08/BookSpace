// SetCountDown.jsx
"use client";
import React from "react";
import Countdown from "./CountDown";

/**
 * SetCountDown — Wrapper for event countdown timer.
 * Accepts an optional targetDate prop. If not provided or in the past,
 * dynamically defaults to 14 days in the future for upcoming events.
 */
function SetCountDown({ targetDate }) {
  const defaultTarget = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const effectiveDate = targetDate && new Date(targetDate) > new Date() ? targetDate : defaultTarget;

  return (
    <div className="App">
      <Countdown targetDate={effectiveDate} />
    </div>
  );
}

export default SetCountDown;
