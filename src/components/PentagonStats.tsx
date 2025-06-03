import React from "react";
import { useSkillTree } from "../context/SkillTreeContext";
import * as d3 from "d3";

const statKeys = ["Power", "Speed", "Endurance", "Technique", "Focus"];

const PentagonStats: React.FC = () => {
  const { skills } = useSkillTree();
  // Sample stat calculation: count # of maxed skills for each stat (for demo)
  const stats = statKeys.map((k, i) => 
    skills.filter(s => (s.level === s.maxLevel) && (i === 0 || i === 1)).length + Math.random() * 2
  );
  const maxStat = 8;
  const points = statKeys.map((_, i) => {
    const angle = Math.PI * 2 * (i / statKeys.length) - Math.PI / 2;
    const r = 120 * (stats[i] / maxStat);
    return [150 + Math.cos(angle) * r, 150 + Math.sin(angle) * r];
  });

  return (
    <div style={{margin: "2em auto", width: 300}}>
      <h2 style={{textAlign: "center", color: "#ffdf58"}}>Your Stats</h2>
      <svg width={300} height={300}>
        {/* Pentagon outline */}
        <polygon
          points={points.map(p => p.join(",")).join(" ")}
          fill="#ffdf5830"
          stroke="#ffdf58"
          strokeWidth={3}
        />
        {/* Axes */}
        {points.map((p, i) => (
          <line
            key={i}
            x1={150} y1={150}
            x2={p[0]} y2={p[1]}
            stroke="#ccc"
            strokeWidth={1}
          />
        ))}
        {/* Stat labels */}
        {points.map((p, i) => (
          <text key={i} x={p[0]} y={p[1] - 12} textAnchor="middle" fill="#fff" fontSize={14}>
            {statKeys[i]}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default PentagonStats;