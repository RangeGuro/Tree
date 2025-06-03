import React from "react";
import type { Achievement } from "../types";

// Color scale: 0% = red, 100% = blue, in between goes through yellow and green
function levelColor(level: number, maxLevel: number) {
  if (maxLevel === 0) return "#fa5252";
  const pct = level / maxLevel;
  if (pct < 0.33) return "#fa5252";
  if (pct < 0.66) return "#ffd700";
  if (pct < 1) return "#4caf50";
  return "#2196f3";
}

const AchievementCard: React.FC<{achievement: Achievement}> = ({ achievement }) => (
  <div style={{
    background: "#2b3042",
    borderRadius: 10,
    padding: "1em 1.5em",
    minWidth: 240,
    flex: "1 0 240px",
    boxShadow: "0 2px 12px #0003",
    border: `3px solid ${levelColor(achievement.level, achievement.maxLevel)}`
  }}>
    <h3 style={{color: levelColor(achievement.level, achievement.maxLevel)}}>{achievement.name}</h3>
    <p>{achievement.description}</p>
    <div style={{margin: "0.7em 0"}}>
      <div style={{fontSize: 13, color: "#ffdf58"}}>Level: {achievement.level}/{achievement.maxLevel}</div>
      <div style={{background: "#444", borderRadius: 7, height: 10}}>
        <div
          style={{
            width: `${(achievement.level / achievement.maxLevel) * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg,#fa5252,#ffd700,#4caf50,#2196f3)`,
            borderRadius: 7
          }}
        />
      </div>
    </div>
    <div style={{fontSize: 13, color: "#ccc"}}>Requirements: {achievement.requirements.map((r, idx) =>
      <span key={idx}>{r.skillId ? `Skill ${r.skillId} Lv${r.minLevel}` : ""}</span>
    )}</div>
  </div>
);

export default AchievementCard;