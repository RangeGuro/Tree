import React from "react";
import "../styles/levels.css";
import { getLevelClass } from "../utils/getLevelClass";

// Example data, replace with your actual data source
const achievements = [
  { name: "First Steps", level: 1 },
  { name: "Expert", level: 10 },
  { name: "Diamond Legend", level: 24 },
  { name: "Golden Pro", level: 19 },
  { name: "Steel Mind", level: 18 },
];

export default function AchievementsPage() {
  return (
    <div>
      <h2>Achievements</h2>
      <div style={{ display: "flex", gap: "1em", flexWrap: "wrap" }}>
        {achievements.map((a, idx) => (
          <div
            key={idx}
            className={`achievement-box ${getLevelClass(a.level)}`}
          >
            {a.name} <br /> <small>Level {a.level}</small>
          </div>
        ))}
      </div>
    </div>
  );
}