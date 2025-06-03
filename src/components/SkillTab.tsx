import React, { useState, useEffect } from "react";
import type { SkillNode } from "../data/skills";
import { getColorForLevel } from "../utils/levelColor";

interface SkillTabProps {
  skill: SkillNode;
  path: string[];
  onClose: () => void;
}

const DRILL_CHECKLIST = [
  "Watched video",
  "Shadow practice",
  "Bag work",
  "Partner drill",
  "Sparring integration",
  "Self-assessment",
];

const MAX_PROGRESS = 25;
const MAX_LEVEL = 20;

function getTabBackgroundStyle(level: number): React.CSSProperties {
  const { color, gradient } = getColorForLevel(level);
  const gradients: Record<string, string> = {
    gold: "linear-gradient(135deg, #fff8d7 0%, #ffd700 60%, #bfa400 100%)",
    ruby: "linear-gradient(135deg, #ffe0ef 0%, #e0115f 65%, #6f0a26 100%)",
    sapphire: "linear-gradient(135deg, #e6f2ff 0%, #0f52ba 65%, #051540 100%)",
    emerald: "linear-gradient(135deg, #d6fff0 0%, #50c878 60%, #145a32 100%)",
    diamond: "linear-gradient(135deg, #ffffff 0%, #b9f2ff 60%, #78c5d6 100%)",
    silver: "linear-gradient(135deg, #ffffff 0%, #c0c0c0 60%, #8f8f8f 100%)",
    bronze: "linear-gradient(135deg, #ffecd2 0%, #cd7f32 70%, #a97142 100%)",
  };
  if (gradient && gradients[gradient]) {
    return {
      background: gradients[gradient],
      color: "#23283a",
      borderRadius: 16,
      boxShadow: "0 6px 32px #0003",
    };
  }
  return {
    background: color,
    color: "#23283a",
    borderRadius: 16,
    boxShadow: "0 6px 32px #0003",
  };
}

export function SkillTab({ skill, path, onClose }: SkillTabProps) {
  const progressKey = `skill-progress-${skill.id}`;
  const levelKey = `skill-level-${skill.id}`;

  const [progress, setProgress] = useState<number>(0);
  const [level, setLevel] = useState<number>(skill.level);

  useEffect(() => {
    setProgress(Number(localStorage.getItem(progressKey)) || 0);
    setLevel(Number(localStorage.getItem(levelKey)) || skill.level);
    // eslint-disable-next-line
  }, [skill.id]);

  const addProgress = () => {
    if (level >= MAX_LEVEL) return;
    if (progress + 1 < MAX_PROGRESS) {
      setProgress((p) => {
        localStorage.setItem(progressKey, String(p + 1));
        return p + 1;
      });
    } else {
      setProgress(0);
      setLevel((l) => {
        localStorage.setItem(progressKey, "0");
        localStorage.setItem(levelKey, String(l + 1));
        return l + 1;
      });
    }
  };

  const removeProgress = () => {
    if (progress > 0) {
      setProgress((p) => {
        localStorage.setItem(progressKey, String(p - 1));
        return p - 1;
      });
    } else if (level > skill.level) {
      setLevel((l) => {
        localStorage.setItem(levelKey, String(l - 1));
        localStorage.setItem(progressKey, String(MAX_PROGRESS - 1));
        setProgress(MAX_PROGRESS - 1);
        return l - 1;
      });
    }
  };

  const { color, gradient } = getColorForLevel(level);

  return (
    <aside
      className="skill-tab-popup"
      style={{
        ...getTabBackgroundStyle(level),
        padding: 32,
        maxWidth: 420,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <button
        className="skill-tab-back"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(255,255,255,0.83)",
          border: "none",
          borderRadius: 9,
          fontWeight: "bold",
          fontSize: 18,
          padding: "2px 18px",
          cursor: "pointer",
          boxShadow: "0 1px 4px #0002",
          zIndex: 2,
        }}
        aria-label="Back"
      >
        ← Back
      </button>
      <div className="skill-tab-header" style={{ textAlign: "center", marginTop: 8 }}>
        <span className="skill-tab-title" style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
          {skill.name}
        </span>
      </div>
      <div className="skill-tab-path" style={{ marginBottom: 12, opacity: 0.85, textAlign: "center" }}>
        {path.join(" > ")}
      </div>
      <div className="skill-tab-section" style={{ marginBottom: 16 }}>
        <b>Description/Drill:</b>
        <div>
          Practice <b>{skill.name}</b> at slow and real speed. Try shadowboxing, bag work, and partner drills if possible.
          {gradient && (
            <div style={{ marginTop: 4, fontSize: "0.95em", color: "#333" }}>
              <span style={{ fontWeight: "bold" }}>Special Node:</span> Gradient type: <span style={{ textTransform: "capitalize" }}>{gradient}</span>
            </div>
          )}
          {!gradient && (
            <div style={{ marginTop: 4, fontSize: "0.95em", color: "#333" }}>
              <span style={{ fontWeight: "bold" }}>Color Node:</span> {color}
            </div>
          )}
        </div>
      </div>
      <div className="skill-tab-section" style={{ marginBottom: 16 }}>
        <b>Your Level:</b>{" "}
        <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
          {level}
        </span>
        <div className="progress-bar-bg" style={{
          background: "rgba(0,0,0,0.15)",
          borderRadius: 6,
          height: 12,
          margin: "8px 0",
          width: "100%",
        }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${(progress / MAX_PROGRESS) * 100}%`,
              background: "#23283a",
              height: "100%",
              borderRadius: 6,
              transition: "width 0.2s"
            }}
          />
        </div>
        <div style={{ fontSize: 13 }}>
          {progress} / {MAX_PROGRESS} to next level
          {level >= MAX_LEVEL && <span style={{ marginLeft: 8, color: "gold" }}>MAX LEVEL</span>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              marginTop: 8,
              background: "#fff",
              color: "#23283a",
              fontWeight: "bold",
              border: "none",
              borderRadius: 8,
              padding: "6px 15px",
              cursor: (level <= skill.level && progress === 0) ? "not-allowed" : "pointer",
              opacity: (level <= skill.level && progress === 0) ? 0.5 : 1
            }}
            disabled={level <= skill.level && progress === 0}
            onClick={removeProgress}
          >
            Remove Progress
          </button>
          <button
            style={{
              marginTop: 8,
              background: "#fff",
              color: "#23283a",
              fontWeight: "bold",
              border: "none",
              borderRadius: 8,
              padding: "6px 15px",
              cursor: level >= MAX_LEVEL ? "default" : "pointer",
              opacity: level >= MAX_LEVEL ? 0.5 : 1
            }}
            disabled={level >= MAX_LEVEL}
            onClick={addProgress}
          >
            {level >= MAX_LEVEL ? "Max Level Reached" : "Add Progress"}
          </button>
        </div>
      </div>
      <div className="skill-tab-section" style={{ marginBottom: 16 }}>
        <b>Checklist:</b>
        <ul style={{ paddingLeft: 22 }}>
          {DRILL_CHECKLIST.map(item => (
            <li key={item}><input type="checkbox" /> {item}</li>
          ))}
        </ul>
      </div>
      <div className="skill-tab-actions" style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button style={{ background: "#fff", color: "#23283a", fontWeight: "bold" }}>View Tutorial</button>
        <button style={{ background: "#fff", color: "#23283a", fontWeight: "bold" }}>Add Journal Entry</button>
      </div>
    </aside>
  );
}