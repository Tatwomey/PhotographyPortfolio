import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown-timer-block">
      <h2>Hurry up!</h2>
      <p>Sale ends in:</p>
      <div className="time">
        <div className="unit">
          <span>{timeLeft.days}</span>
          <span>Days</span>
        </div>
        <div className="unit">
          <span>{timeLeft.hours}</span>
          <span>Hrs</span>
        </div>
        <div className="unit">
          <span>{timeLeft.minutes}</span>
          <span>Mins</span>
        </div>
        <div className="unit">
          <span>{timeLeft.seconds}</span>
          <span>Secs</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
