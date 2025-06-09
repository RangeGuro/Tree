import { useState } from "react";
import type { Achievement, AchievementStage } from "../data/achievements";

export function AchievementModal({
  onSave,
  onClose
}: {
  onSave: (a: Achievement) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🏅");
  const [skillId, setSkillId] = useState("");
  const [metric, setMetric] = useState<"level" | "xp">("level");
  const [stages, setStages] = useState<AchievementStage[]>([
    { name: "Bronze", description: "", goal: 1 }
  ]);

  function handleAddStage() {
    setStages([...stages, { name: `Stage ${stages.length + 1}`, description: "", goal: 1 }]);
  }
  function handleSave() {
    if (!name || !skillId || stages.length === 0) return;
    onSave({
      id: "custom_" + Date.now(),
      name,
      icon,
      skillCriteria: { skillId, metric },
      stages,
      isCustom: true
    });
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 28, minWidth: 360,
        boxShadow: "0 8px 32px #0003", position: "relative"
      }}>
        <button onClick={onClose} style={{ position: "absolute", right: 15, top: 10, fontSize: 18 }}>×</button>
        <h3>Add Custom Achievement</h3>
        <div style={{ marginBottom: 10 }}>
          <label>Icon: <input value={icon} onChange={e => setIcon(e.target.value)} style={{ width: 40, textAlign: "center", fontSize: 21 }} /></label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Name: <input value={name} onChange={e => setName(e.target.value)} style={{ width: "90%" }} /></label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Skill ID: <input value={skillId} onChange={e => setSkillId(e.target.value)} style={{ width: "90%" }} placeholder="e.g. html, js, css" /></label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Metric:
            <select value={metric} onChange={e => setMetric(e.target.value as "level" | "xp")}>
              <option value="level">Level</option>
              <option value="xp">XP</option>
            </select>
          </label>
        </div>
        <div>
          <h4>Stages</h4>
          {stages.map((stage, idx) => (
            <div key={idx} style={{ marginBottom: 7 }}>
              <input
                type="text"
                value={stage.name}
                onChange={e => {
                  const copy = [...stages];
                  copy[idx].name = e.target.value;
                  setStages(copy);
                }}
                style={{ width: 80, marginRight: 5 }}
                placeholder="Stage Name"
              />
              <input
                type="text"
                value={stage.description}
                onChange={e => {
                  const copy = [...stages];
                  copy[idx].description = e.target.value;
                  setStages(copy);
                }}
                style={{ width: 120, marginRight: 5 }}
                placeholder="Description"
              />
              <input
                type="number"
                value={stage.goal}
                onChange={e => {
                  const copy = [...stages];
                  copy[idx].goal = Number(e.target.value);
                  setStages(copy);
                }}
                style={{ width: 60 }}
                placeholder="Goal"
              />
            </div>
          ))}
          <button style={{ marginTop: 5 }} onClick={handleAddStage}>+ Add Stage</button>
        </div>
        <button style={{ marginTop: 16 }} onClick={handleSave}>Save Achievement</button>
      </div>
    </div>
  );
}