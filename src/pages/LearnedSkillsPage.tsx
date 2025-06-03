import React from "react";
import { useSkillTree } from "../context/SkillTreeContext";
import type { SkillNode } from "../data/skills";

const combos = [
  {
    name: "Jab + Cross Combo",
    skills: ["jab", "cross"],
    guide: "Throw a jab with your lead hand, then immediately follow with a cross for a powerful two-punch combo."
  }
];

const LearnedSkillsPage: React.FC = () => {
  const { skills } = useSkillTree();
  const learned = skills.filter(s => s.level > 0);

  return (
    <div style={{maxWidth: 900, margin: "2em auto", background: "#23283a", borderRadius: 16, padding: "2em"}}>
      <h2 style={{color: "#ffdf58"}}>Learned Skills</h2>
      <div style={{display: "flex", flexWrap: "wrap", gap: 24}}>
        {learned.map(s => (
          <div key={s.id} style={{
            background: "#2b3042",
            borderRadius: 10,
            padding: "1em 1.5em",
            minWidth: 200,
            flex: "1 0 200px",
            boxShadow: "0 2px 8px #0003"
          }}>
            <h3 style={{color: "#4caf50"}}>{s.name}</h3>
            <p>{s.description}</p>
            <div style={{fontSize: 13, color: "#ffdf58"}}>Level: {s.level}/{s.maxLevel}</div>
          </div>
        ))}
      </div>
      <h2 style={{color: "#ffdf58", marginTop: 28}}>Combo Guides</h2>
      <div>
        {combos.map((c, i) => {
          const hasAll = c.skills.every(id => learned.find(l => l.id === id));
          return (
            <div key={i} style={{
              background: "#23286a",
              borderRadius: 8,
              padding: "1em",
              marginTop: 12,
              color: "#fff",
              opacity: hasAll ? 1 : 0.5
            }}>
              <b>{c.name}</b> <span style={{color: hasAll ? "#4caf50" : "#fa5252"}}>({hasAll ? "Unlocked" : "Locked"})</span>
              <div style={{marginTop: 4}}>{c.guide}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnedSkillsPage;