import React, { useState, useEffect, useMemo } from "react";
import { hierarchy, tree } from "d3-hierarchy";
import "../styles/levels.css";
import { skillTree as staticSkillTree } from "../data/skills";
import type { SkillNode } from "../data/skills";
import { SkillTab } from "../components/SkillTab";
import { getColorForLevel, getMaxLevel } from "../utils/levelColors";
import { computeAverageLevel } from "../utils/levelAverage";
import { ProgressBar } from "../components/ProgressBar";
import { CustomSkillModal } from "../components/CustomSkillModal";
import SkillTree from "../components/SkillTree";
import { SkillSearchBar } from "../components/SkillSearchBar";

// Utility: recursively collect all nodes for parent selection
function getAllSkills(node: SkillNode): SkillNode[] {
  const result: SkillNode[] = [node];
  if (node.children) {
    for (const child of node.children) {
      result.push(...getAllSkills(child));
    }
  }
  return result;
}

function mergeCustomSkill(tree: SkillNode, skill: SkillNode, parentId: string | null): SkillNode {
  if (!parentId) {
    return {
      ...tree,
      children: [...(tree.children || []), skill]
    };
  }
  function helper(node: SkillNode): SkillNode {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), skill]
      };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => helper(child))
      };
    }
    return node;
  }
  return helper(tree);
}

function loadCustomSkills(): { skill: SkillNode; parentId: string | null }[] {
  try {
    return JSON.parse(localStorage.getItem("customSkills") || "[]");
  } catch {
    return [];
  }
}
function saveCustomSkills(skills: { skill: SkillNode; parentId: string | null }[]) {
  localStorage.setItem("customSkills", JSON.stringify(skills));
}
function isCustomSkill(skill: SkillNode) {
  return skill.id.startsWith("custom_");
}
function removeCustomSkillById(skills: { skill: SkillNode; parentId: string | null }[], id: string) {
  return skills.filter(entry => entry.skill.id !== id);
}

// D3 Visualization constants
const WIDTH = 2000;
const HEIGHT = 2000;
const RADIUS = 900;

function polarToCartesian(angle: number, radius: number): [number, number] {
  return [
    WIDTH / 2 + radius * Math.cos(angle - Math.PI / 2),
    HEIGHT / 2 + radius * Math.sin(angle - Math.PI / 2),
  ];
}

function loadDynamicSkillTree(node: SkillNode): SkillNode {
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
    const avg = computeAverageLevel(tree);
    return { ...tree, level: avg };
  }
  return tree;
}

function getBranchNodes(tree: SkillNode) {
  return tree.children || [];
}

// NEW: Find parentId for a given custom skill
function getCustomSkillParentId(skillId: string): string | null {
  const customSkills = loadCustomSkills();
  const found = customSkills.find(entry => entry.skill.id === skillId);
  return found ? found.parentId : null;
}

export default function SkillTreePage() {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const modalOpen = !!selectedSkill;
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [collapsed, setCollapsed] = useState<{ [id: string]: boolean }>({});
  const [showBranchPanel, setShowBranchPanel] = useState(true);

  const [treeData, setTreeData] = useState<SkillNode>(() => {
    let userTree = withAverageFoundationLevel(loadDynamicSkillTree(staticSkillTree));
    for (const { skill, parentId } of loadCustomSkills()) {
      userTree = mergeCustomSkill(userTree, skill, parentId);
    }
    return userTree;
  });

  const [showCustomModal, setShowCustomModal] = useState(false);
  // For editing
  const [editingSkill, setEditingSkill] = useState<SkillNode | null>(null);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);

  useEffect(() => {
    let userTree = withAverageFoundationLevel(loadDynamicSkillTree(staticSkillTree));
    for (const { skill, parentId } of loadCustomSkills()) {
      userTree = mergeCustomSkill(userTree, skill, parentId);
    }
    setTreeData(userTree);
    // eslint-disable-next-line
  }, [modalOpen, showCustomModal]);

  function handleDeleteCustomSkill(skill: SkillNode) {
    const customSkills = loadCustomSkills();
    const updated = removeCustomSkillById(customSkills, skill.id);
    saveCustomSkills(updated);
    let userTree = withAverageFoundationLevel(loadDynamicSkillTree(staticSkillTree));
    for (const { skill, parentId } of updated) {
      userTree = mergeCustomSkill(userTree, skill, parentId);
    }
    setTreeData(userTree);
    setSelectedSkill(null);
  }

  // NEW: Add/edit handler
  const handleAddOrEditCustomSkill = (newSkill: SkillNode, parentId: string | null) => {
    const customSkills = loadCustomSkills();
    let updated;
    if (editingSkill) {
      updated = customSkills.map(entry =>
        entry.skill.id === newSkill.id
          ? { skill: newSkill, parentId }
          : entry
      );
    } else {
      updated = [...customSkills, { skill: newSkill, parentId }];
    }
    saveCustomSkills(updated);
    let userTree = withAverageFoundationLevel(loadDynamicSkillTree(staticSkillTree));
    for (const { skill, parentId } of updated) {
      userTree = mergeCustomSkill(userTree, skill, parentId);
    }
    setTreeData(userTree);
    setShowCustomModal(false);
    setEditingSkill(null);
    setEditingParentId(null);
  };

  // D3 layout as before
  const root = hierarchy<SkillNode>(treeData);
  const minSeparation = 190;
  const dynamicRadius = Math.max(RADIUS, minSeparation * (root.height + 2));
  const layout = tree<SkillNode>().size([2 * Math.PI, dynamicRadius]).separation(() => 2.2);
  layout(root);

  const onWheel = (e: React.WheelEvent) => {
    if (modalOpen) return;
    e.preventDefault();
    setScale((s) => Math.max(0.2, Math.min(2.7, s - e.deltaY * 0.001)));
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

  function isAncestorCollapsed(node: typeof root): boolean {
    let current = node.parent;
    while (current) {
      if (collapsed[current.data.id]) return true;
      current = current.parent;
    }
    return false;
  }

  const branches = getBranchNodes(treeData);

  function handleExpandAll() {
    const all: { [id: string]: boolean } = {};
    branches.forEach(b => { all[b.id] = false; });
    setCollapsed(all);
  }
  function handleCollapseAll() {
    const all: { [id: string]: boolean } = {};
    branches.forEach(b => { all[b.id] = true; });
    setCollapsed(all);
  }
  function handleToggleBranch(branchId: string) {
    setCollapsed(prev => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  }

  const maxLevel = getMaxLevel();
  function getNodeRadius(name: string) {
    const base = 54;
    const chars = Math.max(name.length, 10);
    if (chars > 16) return base + 2.5 * (chars - 8) * 0.7;
    return base + 2.5 * (chars - 10);
  }
  function splitSkillName(name: string) {
    if (name.length <= 16) return [name];
    const mid = Math.floor(name.length / 2);
    let idx = name.lastIndexOf(" ", mid);
    if (idx === -1) idx = name.indexOf(" ", mid);
    if (idx === -1) return [name];
    return [name.slice(0, idx), name.slice(idx + 1)];
  }

  const allNodes = useMemo(() => getAllSkills(treeData), [treeData]);

  // For editing: get parentId of custom skill
  function onEditCustomSkill(skill: SkillNode) {
    setEditingSkill(skill);
    setEditingParentId(getCustomSkillParentId(skill.id));
  }

  // --- SEARCH/HIGHLIGHT LOGIC ---
  // Memoize for performance, highlight/fade based on search
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
  const searchNodeMap = useMemo(() => {
    if (!search.trim()) return {};
    const result: Record<string, boolean> = {};
    allNodes.forEach(s => {
      if (matchesSkill(s, search)) result[s.id] = true;
    });
    return result;
  }, [search, allNodes]);

  // --- RENDER ---
  return (
    <div>
      <h2 style={{color: "#fff", textAlign: "center"}}>Skill Tree</h2>
      <SkillSearchBar value={search} onChange={setSearch} />
      <div style={{textAlign: "center", margin: "12px 0"}}>
        <button onClick={() => { setShowCustomModal(true); setEditingSkill(null); setEditingParentId(null); }}>+ Add Custom Skill</button>
      </div>
      {(showCustomModal || editingSkill) && (
        <CustomSkillModal
          parents={allNodes}
          onSave={handleAddOrEditCustomSkill}
          onClose={() => { setShowCustomModal(false); setEditingSkill(null); setEditingParentId(null); }}
          initialSkill={editingSkill || undefined}
          initialParentId={editingParentId ?? undefined}
        />
      )}
      {showBranchPanel ? (
        <div className="branch-panel-float">
          <div className="branch-panel-header">
            <span className="branch-panel-title">Branches</span>
            <button
              className="branch-panel-hide-btn"
              onClick={() => setShowBranchPanel(false)}
              aria-label="Hide branch panel"
              title="Hide branch panel"
            >✕ Hide</button>
          </div>
          {branches.map(branch => (
            <div key={branch.id} style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
              <button
                onClick={() => handleToggleBranch(branch.id)}
                style={{
                  width: 26,
                  height: 26,
                  marginRight: 7,
                  borderRadius: 6,
                  border: "1.5px solid #bbb",
                  background: "#23283a",
                  fontWeight: "bold",
                  fontSize: 16,
                  cursor: "pointer",
                  color: collapsed[branch.id] ? "#ff8f8f" : "#8fff8f",
                  boxShadow: "0 1px 2px #0001"
                }}
                aria-label={collapsed[branch.id] ? "Expand branch" : "Collapse branch"}
                title={collapsed[branch.id] ? "Expand branch" : "Collapse branch"}
              >
                {collapsed[branch.id] ? "▶" : "▼"}
              </button>
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#fff"
              }}>{branch.name}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            <button
              onClick={handleExpandAll}
              style={{
                flex: 1,
                borderRadius: 7,
                border: "1.5px solid #bbb",
                background: "#23283a",
                color: "#fff",
                padding: "4px 0",
                fontWeight: "bold",
                fontSize: 15,
                cursor: "pointer"
              }}
            >Expand All</button>
            <button
              onClick={handleCollapseAll}
              style={{
                flex: 1,
                borderRadius: 7,
                border: "1.5px solid #bbb",
                background: "#23283a",
                color: "#fff",
                padding: "4px 0",
                fontWeight: "bold",
                fontSize: 15,
                cursor: "pointer"
              }}
            >Collapse All</button>
          </div>
        </div>
      ) : (
        <button
          className="branch-panel-toggle-btn"
          onClick={() => setShowBranchPanel(true)}
          aria-label="Show branch panel"
          title="Show branch panel"
        >
          ☰ Branches
        </button>
      )}
      <div
        className="skill-tree-bg"
        style={{
          width: WIDTH,
          height: HEIGHT,
          border: "1px solid #23283a",
          margin: "0 auto",
          borderRadius: "12px",
          background: "#181a21"
        }}
      >
        <svg
          width={WIDTH}
          height={HEIGHT}
          style={{
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            display: "block",
            background: "#181a21"
          }}
          onWheel={modalOpen ? undefined : onWheel}
          onMouseDown={modalOpen ? undefined : onMouseDown}
          onMouseMove={modalOpen ? undefined : onMouseMove}
          onMouseUp={modalOpen ? undefined : onMouseUp}
          onMouseLeave={modalOpen ? undefined : onMouseUp}
        >
          <defs>
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
              if (
                collapsed[link.source.data.id] ||
                isAncestorCollapsed(link.source) ||
                isAncestorCollapsed(link.target)
              )
                return null;
              const [x1, y1] = polarToCartesian(link.source.x ?? 0, link.source.y ?? 0);
              const [x2, y2] = polarToCartesian(link.target.x ?? 0, link.target.y ?? 0);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#444"
                  strokeWidth={2}
                />
              );
            })}
            {root.descendants().map((node, i) => {
              if (isAncestorCollapsed(node)) return null;
              const [x, y] = polarToCartesian(node.x ?? 0, node.y ?? 0);
              const isSelected = selectedSkill?.id === node.data.id;
              const { color, gradient } = getColorForLevel(node.data.level);
              const percent = Math.min(100, (node.data.level / maxLevel) * 100);
              const nameLines = splitSkillName(node.data.name);
              const radius = getNodeRadius(node.data.name);
              const fontSize = Math.max(14, Math.min(22, Math.floor(radius / 2.3 / nameLines.length)));
              const isHighlighted = !!searchNodeMap[node.data.id];
              const faded = search.trim() && !isHighlighted;
              return (
                <g
                  key={i}
                  transform={`translate(${x},${y})`}
                  style={{
                    cursor: "pointer",
                    opacity: faded ? 0.23 : 1,
                    transition: "opacity 0.2s"
                  }}
                  onClick={() => handleNodeClick(node)}
                >
                  <circle
                    r={isSelected ? radius + 8 : radius}
                    stroke={isHighlighted ? "#f7e146" : (isSelected ? "#e91e63" : "#fff")}
                    strokeWidth={isHighlighted ? 6 : (isSelected ? 4 : 2)}
                    fill={gradient ? `url(#${gradient}-gradient)` : color}
                    style={isHighlighted ? {
                      filter: "drop-shadow(0 0 14px #ffe066dd)"
                    } : undefined}
                  />
                  <foreignObject
                    x={-radius * 0.95}
                    y={-radius * 0.5}
                    width={radius * 1.9}
                    height={radius * 1.2}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "#fff",
                        fontSize,
                        textAlign: "center",
                        lineHeight: 1.12,
                        wordBreak: "break-word",
                        textShadow: "0 2px 12px #000, 0 0px 2px #0008"
                      }}
                    >
                      {nameLines.map((line, idx) => (
                        <span key={idx}>{line}</span>
                      ))}
                    </div>
                  </foreignObject>
                  <foreignObject
                    x={-radius * 0.7}
                    y={radius * 0.8}
                    width={radius * 1.4}
                    height={16}
                  >
                    <div style={{ width: "100%" }}>
                      <ProgressBar percent={percent} color={color} height={8} />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, color: "#eee" }}>
        <small>Scroll to zoom, drag to pan, click nodes! Use the panel to expand/collapse branches.</small>
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
            onDeleteSkill={handleDeleteCustomSkill}
            onEditCustomSkill={
              isCustomSkill(selectedSkill)
                ? () => onEditCustomSkill(selectedSkill)
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}