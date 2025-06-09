import { useMemo, useState } from "react";
import { skillTree } from "../data/skills";
import { getColorForLevel } from "../utils/levelColors";
import { SkillTab } from "../components/SkillTab";
import type { SkillNode } from "../data/skills";
import { ProgressBar } from "../components/ProgressBar";
import { CustomSkillModal } from "../components/CustomSkillModal";
import { SkillSearchBar } from "../components/SkillSearchBar";
import "../styles/levels.css";

// Helpers for custom skills (consider sharing between files)
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
    return { ...tree, children: [...(tree.children || []), skill] };
  }
  function helper(node: SkillNode): SkillNode {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), skill] };
    }
    if (node.children) {
      return { ...node, children: node.children.map(child => helper(child)) };
    }
    return node;
  }
  return helper(tree);
}
function loadCustomSkills(): { skill: SkillNode; parentId: string | null }[] {
  try { return JSON.parse(localStorage.getItem("customSkills") || "[]"); } catch { return []; }
}
function saveCustomSkills(skills: { skill: SkillNode; parentId: string | null }[]) {
  localStorage.setItem("customSkills", JSON.stringify(skills));
}
function removeCustomSkillById(skills: { skill: SkillNode; parentId: string | null }[], id: string) {
  return skills.filter(entry => entry.skill.id !== id);
}

export default function LearnedSkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [search, setSearch] = useState("");
  const [tree, setTree] = useState<SkillNode>(() => {
    let userTree = skillTree;
    for (const { skill, parentId } of loadCustomSkills()) {
      userTree = mergeCustomSkill(userTree, skill, parentId);
    }
    return userTree;
  });

  function handleDeleteCustomSkill(skill: SkillNode) {
    const customSkills = loadCustomSkills();
    const updated = removeCustomSkillById(customSkills, skill.id);
    saveCustomSkills(updated);
    let userTree = skillTree;
    for (const { skill, parentId } of updated) {
      userTree = mergeCustomSkill(userTree, skill, parentId);
    }
    setTree(userTree);
    setSelectedSkill(null);
  }

  // Show skills with any progress at all
  const learnedSkills = useMemo(() => {
    const allSkills = getAllSkills(tree);
    return allSkills
      .map(skill => {
        const level = Number(localStorage.getItem(`skill-level-${skill.id}`)) || skill.level || 0;
        const xp = Number(localStorage.getItem(`skill-xp-${skill.id}`)) || 0;
        return { ...skill, level, xp };
      })
      .filter(skill => skill.level > 0 || skill.xp > 0);
  }, [tree]);

  function findSkillPath(skill: SkillNode): string[] {
    const path: string[] = [];
    function dfs(node: SkillNode, currPath: string[]): boolean {
      if (node.id === skill.id) {
        path.push(...currPath, node.name);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (dfs(child, [...currPath, node.name])) return true;
        }
      }
      return false;
    }
    dfs(tree, []);
    return path;
  }

  const allNodes = useMemo(() => getAllSkills(tree), [tree]);
  const handleAddCustomSkill = (newSkill: SkillNode, parentId: string | null) => {
    const customSkills = loadCustomSkills();
    customSkills.push({ skill: newSkill, parentId });
    saveCustomSkills(customSkills);
    setTree(prev => mergeCustomSkill(prev, newSkill, parentId));
    setShowCustomModal(false);
  };

  // SEARCH: filter learnedSkills by name, description, or tags (defensive for missing tags)
  const filteredSkills = useMemo(() => {
    if (!search.trim()) return learnedSkills;
    const q = search.toLowerCase();
    return learnedSkills.filter(skill =>
      skill.name.toLowerCase().includes(q) ||
      (skill.description && skill.description.toLowerCase().includes(q)) ||
      (Array.isArray(skill.tags) && skill.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  }, [learnedSkills, search]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h2>Learned Skills</h2>
      <SkillSearchBar value={search} onChange={setSearch} />
      <div style={{textAlign: "center", margin: "12px 0"}}>
        <button onClick={() => setShowCustomModal(true)}>+ Add Custom Skill</button>
      </div>
      {showCustomModal && (
        <CustomSkillModal
          parents={allNodes}
          onSave={handleAddCustomSkill}
          onClose={() => setShowCustomModal(false)}
        />
      )}
      {filteredSkills.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 48, color: "#888", fontSize: 24 }}>
          No learned skills found.<br />{learnedSkills.length === 0 ? "Level up skills in the Skill Tree to see them here!" : "Try a different search."}
        </div>
      )}
      <div className="learned-skills-grid" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 22,
        marginTop: 18,
        justifyContent: "center"
      }}>
        {filteredSkills.map(skill => {
          const { color, gradient } = getColorForLevel(skill.level);
          const percent = Math.min(100, (skill.xp / 100) * 100);

          return (
            <div
              key={skill.id}
              className="skill-node"
              style={{
                minWidth: 190,
                maxWidth: 270,
                cursor: "pointer",
                position: "relative",
                background: gradient ? undefined : color,
                backgroundImage: gradient
                  ? `linear-gradient(135deg, ${color}, var(--${gradient}-gradient-end, #fff))`
                  : undefined,
                color: "#222",
                borderRadius: 12,
                boxShadow: "0 2px 10px #0001",
                padding: "18px 18px 16px 18px",
                marginBottom: 6,
              }}
              onClick={() => {
                setSelectedSkill(skill);
                setSelectedPath(findSkillPath(skill));
              }}
              tabIndex={0}
              title={`Level ${skill.level} (${skill.xp}/100 XP)`}
            >
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{skill.name}</div>
              <div style={{
                fontSize: 13,
                color: "#333",
                marginBottom: 4,
                opacity: 0.72
              }}>
                Level: <b>{skill.level}</b>
              </div>
              <div style={{
                fontSize: 13,
                color: "#555",
                marginBottom: 6,
                opacity: 0.7
              }}>
                XP: <b>{skill.xp}</b> / 100
              </div>
              <ProgressBar percent={percent} color={color} />
              {skill.children && <div style={{ position: "absolute", right: 10, top: 10, fontSize: 18 }}>🧩</div>}
            </div>
          );
        })}
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
          />
        </div>
      )}
    </div>
  );
}