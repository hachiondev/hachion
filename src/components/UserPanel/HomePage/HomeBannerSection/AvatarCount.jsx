"use client";

import React, { useState, useEffect } from "react";
import "../../Home.css";

const randomAvatars = [
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13",
  "https://i.pravatar.cc/150?img=14",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=16",
];

export default function CustomSurplusAvatars() {
  // Deterministic on first render (server + client's initial hydration
  // pass both render the same first-5) so Math.random() never causes a
  // hydration mismatch; the real shuffle happens client-side right after
  // mount, matching the CRA original's "shuffle once" behavior just
  // deferred by one effect tick.
  const [shuffled, setShuffled] = useState(() => randomAvatars.slice(0, 5));

  useEffect(() => {
    setShuffled([...randomAvatars].sort(() => 0.5 - Math.random()).slice(0, 5));
  }, []);

  return (
    <div className="avatar-group">
      {shuffled.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Learner avatar ${index + 1}`}
          className="avatar-img"
          width={150}
          height={150}
        />
      ))}

      <div className="avatar-number">+25k</div>
    </div>
  );
}
