import { useState, useEffect } from "react";
import { hierarchy, tree } from "d3-hierarchy";
import "../styles/levels.css";
import { skillTree as staticSkillTree } from "../data/skills";
import type { SkillNode } from "../data/skills";
import { SkillTab } from "../components/SkillTab";
import { getColorForLevel } from "../utils/levelColor";
import { computeAverageLevel } from "../utils/levelAverage";

const WIDTH = 1000;
const HEIGHT = 1000;
const RADIUS = 450;

function polarToCartesian(angle: number, radius: number): [number, number] {
  return [
    WIDTH / 2 + radius * Math.cos(angle - Math.PI / 2),
    HEIGHT / 2 + radius * Math.sin(angle - Math.PI / 2),
  ];
}

function getNodeFill(level: number): string | undefined {
  const { color, gradient } = getColorForLevel(level);
  if (gradient) return `url(#${gradient}-gradient)`;
  return color;
}

// Recursively updates node levels from localStorage and computes foundation level
function loadDynamicSkillTree(node: SkillNode): SkillNode {
  // Load from localStorage or fallback to static
  const levelKey = `skill-level-${node.id}`;
  let level = Number(localStorage.getItem(levelKey));
  if (isNaN(level)) level = node.level;
  let children: SkillNode[] | undefined;
  if (node.children) {
    children = node.children.map(loadDynamicSkillTree);
  }
  return {
    ...node,
    level,
    children,
  };
}

function withAverageFoundationLevel(tree: SkillNode): SkillNode {
  if (tree.children) {
    // Only for foundation node
    const avg = computeAverageLevel(tree);
    return { ...tree, level: avg };
  }
  return tree;
}

export default function SkillTreePage() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const modalOpen = !!selectedSkill;
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Dynamically load levels (localStorage) and update foundation
  const [treeData, setTreeData] = useState<SkillNode>(() =>
    withAverageFoundationLevel(loadDynamicSkillTree(staticSkillTree))
  );

  // Recompute treeData on modal close (i.e., after any changes)
  useEffect(() => {
    setTreeData(withAverageFoundationLevel(loadDynamicSkillTree(staticSkillTree)));
  }, [modalOpen]);

  const root = hierarchy<SkillNode>(treeData);
  const minSeparation = 80;
  const dynamicRadius = Math.max(RADIUS, minSeparation * (root.height + 2));
  const layout = tree<SkillNode>().size([2 * Math.PI, dynamicRadius]);
  layout(root);

  const onWheel = (e: React.WheelEvent) => {
    if (modalOpen) return;
    e.preventDefault();
    setScale((s) => Math.max(0.5, Math.min(2.7, s - e.deltaY * 0.001)));
  };
  const onMouseDown = (e: React.MouseEvent) => {
    if (modalOpen) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (modalOpen || !dragging || !dragStart) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => {
    if (modalOpen) return;
    setDragging(false);
  };

  function handleNodeClick(node: typeof root) {
    setSelectedSkill(node.data);
    setSelectedPath(node.ancestors().reverse().map(n => n.data.name));
  }

  return (
    <div>
      <h2>Skill Tree</h2>
      <div
        className="skill-tree-bg"
        style={{
          width: WIDTH,
          height: HEIGHT,
          border: "1px solid #eee",
          margin: "0 auto",
          borderRadius: "12px",
        }}
      >
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            display: "block",
            background: "transparent"
          }}
          onWheel={modalOpen ? undefined : onWheel}
          onMouseDown={modalOpen ? undefined : onMouseDown}
          onMouseMove={modalOpen ? undefined : onMouseMove}
          onMouseUp={modalOpen ? undefined : onMouseUp}
          onMouseLeave={modalOpen ? undefined : onMouseUp}
        >
          <defs>
            {/* Gradients for each level */}
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff8d7"/>
              <stop offset="30%" stopColor="#ffd700"/>
              <stop offset="70%" stopColor="#bfa400"/>
              <stop offset="100%" stopColor="#a67c00"/>
            </linearGradient>
            <linearGradient id="ruby-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe0ef"/>
              <stop offset="35%" stopColor="#e0115f"/>
              <stop offset="80%" stopColor="#a1063d"/>
              <stop offset="100%" stopColor="#6f0a26"/>
            </linearGradient>
            <linearGradient id="sapphire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e6f2ff"/>
              <stop offset="30%" stopColor="#0f52ba"/>
              <stop offset="80%" stopColor="#082567"/>
              <stop offset="100%" stopColor="#051540"/>
            </linearGradient>
            <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d6fff0"/>
              <stop offset="35%" stopColor="#50c878"/>
              <stop offset="80%" stopColor="#228b22"/>
              <stop offset="100%" stopColor="#145a32"/>
            </linearGradient>
            <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="40%" stopColor="#b9f2ff"/>
              <stop offset="80%" stopColor="#aeefff"/>
              <stop offset="100%" stopColor="#78c5d6"/>
            </linearGradient>
            <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="30%" stopColor="#c0c0c0"/>
              <stop offset="80%" stopColor="#b0b0b0"/>
              <stop offset="100%" stopColor="#8f8f8f"/>
            </linearGradient>
            <linearGradient id="bronze-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffecd2"/>
              <stop offset="70%" stopColor="#cd7f32"/>
              <stop offset="100%" stopColor="#a97142"/>
            </linearGradient>
          </defs>
          <g
            transform={`translate(${offset.x},${offset.y}) scale(${scale})`}
          >
            {root.links().map((link, i) => {
              const [x1, y1] = polarToCartesian(link.source.x ?? 0, link.source.y ?? 0);
              const [x2, y2] = polarToCartesian(link.target.x ?? 0, link.target.y ?? 0);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#aaa"
                  strokeWidth={2}
                />
              );
            })}
            {root.descendants().map((node, i) => {
              const [x, y] = polarToCartesian(node.x ?? 0, node.y ?? 0);
              const isSelected = selectedSkill?.id === node.data.id;
              return (
                <g
                  key={i}
                  transform={`translate(${x},${y})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNodeClick(node)}
                >
                  <circle
                    r={isSelected ? 36 : 28}
                    stroke={isSelected ? "#e91e63" : "#23283a"}
                    strokeWidth={isSelected ? 4 : 2}
                    fill={getNodeFill(node.data.level)}
                  />
                  <text
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="12"
                    fill="#23283a"
                    style={{ pointerEvents: "none", fontWeight: "bold", userSelect: "none" }}
                    y={0}
                  >
                    {node.data.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <small>Scroll to zoom, drag to pan, click nodes!</small>
      </div>
      {selectedSkill && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <SkillTab
            skill={selectedSkill}
            path={selectedPath}
            onClose={() => setSelectedSkill(null)}
          />
        </div>
      )}
    </div>
  );
}