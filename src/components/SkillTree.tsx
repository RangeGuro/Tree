import React, { useMemo, useState } from "react";
import { useSkillTree } from "../context/SkillTreeContext";
import SkillNodeModal from "./SkillNodeModal";
import * as d3 from "d3";
import type { SkillNode } from "../types";

// Color scale: 0% = red, 100% = blue, in between goes through yellow and green
function levelColor(level: number, maxLevel: number) {
  const pct = maxLevel === 0 ? 0 : level / maxLevel;
  const scale = d3.scaleLinear<string>()
    .domain([0, 0.33, 0.66, 1])
    .range(["#fa5252", "#ffd700", "#4caf50", "#2196f3"])
    .clamp(true);
  return scale(pct);
}

function matchesSkill(skill: SkillNode, query: string): boolean {
  if (!query.trim()) return false;
  const q = query.toLowerCase();
  if (skill.name.toLowerCase().includes(q)) return true;
  if (skill.description && skill.description.toLowerCase().includes(q)) return true;
  if ((skill as any).tags && Array.isArray((skill as any).tags)) {
    if ((skill as any).tags.some((t: string) => t.toLowerCase().includes(q))) return true;
  }
  return false;
}

const width = 800, height = 600, center = {x: width/2, y: height/2};

interface SkillTreeProps {
  searchQuery?: string;
}
const SkillTree: React.FC<SkillTreeProps> = ({ searchQuery = "" }) => {
  const { skills } = useSkillTree();
  const [selected, setSelected] = useState<SkillNode | null>(null);

  // Map skills by id
  const skillMap = Object.fromEntries(skills.map(s => [s.id, s]));

  // Compute node positions (already in sample data, but could be calculated for new nodes)
  const nodes = skills.map(n => ({
    ...n,
    x: center.x + Math.cos((n.position.angle / 180) * Math.PI) * n.position.radius,
    y: center.y + Math.sin((n.position.angle / 180) * Math.PI) * n.position.radius
  }));

  // Compute highlight/fade for all nodes
  const nodeHighlight = useMemo(() => {
    if (!searchQuery.trim()) return {};
    const result: Record<string, boolean> = {};
    for (const n of nodes) {
      if (matchesSkill(n, searchQuery)) result[n.id] = true;
    }
    return result;
  }, [searchQuery, nodes]);

  // Render lines (edges)
  const lines = [];
  for (const n of nodes) {
    for (const childId of n.children) {
      const child = skillMap[childId];
      if (child) {
        // Color matches the lowest-level node of the two
        const lColor = levelColor(
          Math.min(n.level, child.level),
          Math.min(n.maxLevel, child.maxLevel)
        );
        lines.push(
          <line
            key={n.id + "-" + child.id}
            x1={n.x} y1={n.y}
            x2={center.x + Math.cos((child.position.angle / 180) * Math.PI) * child.position.radius}
            y2={center.y + Math.sin((child.position.angle / 180) * Math.PI) * child.position.radius}
            stroke={lColor}
            strokeWidth={4}
            opacity={0.7}
          />
        );
      }
    }
  }

  // Render skill nodes
  const nodeCircles = nodes.map(n => {
    const isHighlighted = !!nodeHighlight[n.id];
    const faded = searchQuery.trim() && !isHighlighted;
    return (
      <g
        key={n.id}
        tabIndex={0}
        onClick={() => setSelected(n)}
        style={{cursor: "pointer", opacity: faded ? 0.23 : 1, transition: "opacity 0.2s"}}
      >
        <circle
          cx={n.x}
          cy={n.y}
          r={35}
          fill={levelColor(n.level, n.maxLevel)}
          stroke={isHighlighted ? "#f7e146" : "#fff"}
          strokeWidth={n.level === n.maxLevel ? 6 : 2}
          style={isHighlighted ? {
            filter: "drop-shadow(0 0 14px #ffe066dd)"
          } : undefined}
        />
        <text
          x={n.x}
          y={n.y + 5}
          textAnchor="middle"
          fontWeight="bold"
          fontSize={15}
          fill="#23283a"
        >
          {n.name}
        </text>
        <text
          x={n.x}
          y={n.y + 27}
          textAnchor="middle"
          fontSize={12}
          fill="#fff"
        >
          Lv {n.level}/{n.maxLevel}
        </text>
      </g>
    );
  });

  return (
    <div style={{margin: "0 auto", width: width, height: height, position: "relative"}}>
      <svg width={width} height={height}>
        {/* Edges */}
        {lines}
        {/* Nodes */}
        {nodeCircles}
      </svg>
      {selected && (
        <SkillNodeModal node={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default SkillTree;