"use client";

import React from 'react';

const PokeBallSpinner = () => {
  return (
    <svg className="animate-spin h-10 w-10" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="white"
        stroke="red"
        strokeWidth="8"
      />
      <path
        d="M5 50 h90"
        stroke="red"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="white"
        stroke="red"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="white"
      />
    </svg>
  );
};

export default PokeBallSpinner;