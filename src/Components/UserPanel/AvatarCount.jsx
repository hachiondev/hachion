import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import "./Home.css";

export default function CustomSurplusAvatars() {
  // Random avatar image sources
  const randomAvatars = [
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=13",
    "https://i.pravatar.cc/150?img=14",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=16",
  ];

  const shuffled = randomAvatars.sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <AvatarGroup max={6} className="avatar-group">
      {shuffled.map((src, index) => (
        <Avatar key={index} src={src} />
      ))}

      <Avatar className="avatar-number">+25k</Avatar>
    </AvatarGroup>
  );
}
