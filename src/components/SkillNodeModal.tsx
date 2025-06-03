import React, { useState } from "react";
import type { SkillNode } from "../types";
import { useSkillTree } from "../context/SkillTreeContext";

const SkillNodeModal: React.FC<{node: SkillNode, onClose: () => void}> = ({ node, onClose }) => {
  const { skills, setSkills } = useSkillTree();
  const minLevel = (node as any).minLevel ?? 0; // fallback to 0 if minLevel is not defined
  const [level, setLevel] = useState(node.level);

  const handleLevelUp = () => {
    if (level < node.maxLevel) setLevel(level + 1);
  };
  const handleLevelDown = () => {
    if (level > minLevel) setLevel(level - 1);
  };
  const handleSave = () => {
    setSkills(skills.map(s => s.id === node.id ? {...s, level} : s));
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "#222cfa99", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#2b3042", color: "#fff", padding: "2em 2.5em",
          borderRadius: 18, minWidth: 350, maxWidth: 460, boxShadow: "0 4px 32px #000a"
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{color: "#ffdf58", textAlign: "center"}}>{node.name}</h2>
        <p style={{marginBottom: 12}}>{node.description}</p>
        {/* Progress bar */}
        <div style={{margin: "1em 0"}}>
          <div style={{marginBottom: 4}}>Level: {level}/{node.maxLevel}</div>
          <div style={{background: "#444", borderRadius: 7, height: 14}}>
            <div
              style={{
                width: `${(level / node.maxLevel) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg,#fa5252,#ffd700,#4caf50,#2196f3)",
                borderRadius: 7
              }}
            />
          </div>
        </div>
        {/* Youtube link */}
        {node.youtubeUrl && (
          <a
            href={node.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{color: "#2196f3", fontWeight: 500, display: "block", marginBottom: 10}}
          >
            Watch Tutorial
          </a>
        )}
        {/* Guide */}
        {node.guide && (
          <div style={{margin: "1em 0"}}>
            <div style={{fontWeight: "bold", marginBottom: 4}}>Step-by-step guide:</div>
            <ul style={{margin: 0, paddingLeft: 18}}>
              {node.guide.map((step, idx) => <li key={idx}>{step}</li>)}
            </ul>
          </div>
        )}
        {/* Level controls */}
        <div style={{display: "flex", justifyContent: "center", gap: 12, margin: "1em 0"}}>
          <button onClick={handleLevelDown} disabled={level <= minLevel}>-</button>
          <button onClick={handleLevelUp} disabled={level >= node.maxLevel}>+</button>
        </div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <button onClick={onClose} style={{marginTop: 12}}>Cancel</button>
          <button onClick={handleSave} style={{marginTop: 12}}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SkillNodeModal;