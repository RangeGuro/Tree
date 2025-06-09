import React from "react";
import { useSkillTree } from "../context/SkillTreeContext";

const statKeys = ["Power", "Speed", "Endurance", "Technique", "Focus"];

const PentagonStats: React.FC = () => {
  const { skills } = useSkillTree();
  // For demo: use mock logic, replace with real stat calculation as needed.
  const stats = statKeys.map((k, i) =>
    skills.filter(s => (s.level === s.maxLevel) && (i === 0 || i === 1)).length + Math.random() * 2
  );
  const maxStat = 8;
  const center = 150;
  const rBase = 120;
  const points = statKeys.map((_, i) => {
    const angle = Math.PI * 2 * (i / statKeys.length) - Math.PI / 2;
    const r = rBase * (stats[i] / maxStat);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  });
  // For grid: faded pentagon at 100% stat
  const gridPoints = statKeys.map((_, i) => {
    const angle = Math.PI * 2 * (i / statKeys.length) - Math.PI / 2;
    return [center + Math.cos(angle) * rBase, center + Math.sin(angle) * rBase];
  });

  return (
    <div style={{
      margin: "2em auto 2.2em auto",
      width: 320,
      padding: "1em 0.5em 1.5em 0.5em",
      background: "rgba(40,50,70,0.7)",
      borderRadius: 18,
      boxShadow: "0 2px 16px #0002",
    }}>
      <h2 style={{
        textAlign: "center",
        color: "#ffdf58",
        marginBottom: 12,
        fontWeight: 700,
        letterSpacing: "0.02em",
        textShadow: "0 2px 16px #0008"
      }}>
        Your Stats
      </h2>
      <svg width={300} height={300}>
        {/* Faded full pentagon grid */}
        <polygon
          points={gridPoints.map(p => p.join(",")).join(" ")}
          fill="#ffdf5815"
          stroke="#ffdf58"
          strokeWidth={1}
        />
        {/* Stat pentagon */}
        <polygon
          points={points.map(p => p.join(",")).join(" ")}
          fill="url(#statGrad)"
          stroke="#ffdf58"
          strokeWidth={3}
          style={{ filter: "drop-shadow(0 2px 6px #ffdf5870)" }}
        />
        <defs>
          <linearGradient id="statGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#ff7e5f" />
          </linearGradient>
        </defs>
        {/* Axes */}
        {points.map((p, i) => (
          <line
            key={i}
            x1={center} y1={center}
            x2={p[0]} y2={p[1]}
            stroke="#bbb"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        ))}
        {/* Stat labels */}
        {gridPoints.map((p, i) => (
          <text
            key={i}
            x={p[0]}
            y={p[1] - 16}
            textAnchor="middle"
            fill="#fff"
            fontSize={15}
            fontWeight={600}
            style={{
              textShadow: "0 2px 8px #222, 0 0 6px #ffdf5875",
              letterSpacing: "0.04em"
            }}
          >
            {statKeys[i]}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default PentagonStats;