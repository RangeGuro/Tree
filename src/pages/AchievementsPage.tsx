import { useMemo, useState } from "react";
import { achievements as builtInAchievements } from "../data/achievements";
import type { Achievement } from "../data/achievements";
import { getUserSkills } from "../utils/userSkills";
import { getAchievementProgress } from "../utils/achievementUtils";
import { getAchievementColorByPercent } from "../utils/achievementColor";
import { ProgressBar } from "../components/ProgressBar";
import { AchievementModal } from "../components/AchievementModal";
import { getMaxLevel } from "../utils/levelColors";

function loadCustomAchievements(): Achievement[] {
  try { return JSON.parse(localStorage.getItem("customAchievements") || "[]"); } catch { return []; }
}
function saveCustomAchievements(list: Achievement[]) {
  localStorage.setItem("customAchievements", JSON.stringify(list));
}

export default function AchievementsPage() {
  const [showModal, setShowModal] = useState(false);
  const [customAchievements, setCustomAchievements] = useState<Achievement[]>(() => loadCustomAchievements());
  const skills = useMemo(() => getUserSkills(), []);
  const allAchievements = useMemo(
    () => [...builtInAchievements, ...customAchievements],
    [customAchievements]
  );

  function handleAddAchievement(a: Achievement) {
    const updated = [...customAchievements, { ...a, isCustom: true }];
    setCustomAchievements(updated);
    saveCustomAchievements(updated);
    setShowModal(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h2>Achievements</h2>
      <button style={{ margin: 10 }} onClick={() => setShowModal(true)}>+ Add Custom Achievement</button>
      {showModal && (
        <AchievementModal onSave={handleAddAchievement} onClose={() => setShowModal(false)} />
      )}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 22,
        marginTop: 18,
        justifyContent: "center"
      }}>
        {allAchievements.map(a => {
          const { stageIdx, percent, value } = getAchievementProgress(a, skills);
          // percent is progress toward this achievement's max stage
          const colorObj = getAchievementColorByPercent(percent);
          const curStage = a.stages[stageIdx] || null;
          const nextStage = a.stages[stageIdx + 1] || null;
          return (
            <div key={a.id}
              style={{
                minWidth: 210,
                maxWidth: 310,
                background: colorObj.color,
                // You could also use gradients if desired:
                // background: colorObj.gradient ? colorObj.color : undefined,
                color: "#222",
                border: "2px solid #bbb",
                borderRadius: 14,
                boxShadow: "0 2px 10px #0001",
                padding: "20px 18px",
                position: "relative",
                opacity: percent === 100 ? 1 : 0.85,
                transition: "background 0.4s"
              }}>
              <div style={{ fontSize: 42, textAlign: "center", marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
                {a.name}
              </div>
              <div style={{ fontSize: 15, marginBottom: 6, opacity: 0.85 }}>
                {curStage ? curStage.description : a.stages[0].description}
              </div>
              <div style={{ fontSize: 13, marginBottom: 6 }}>
                Current: {value} {a.skillCriteria.metric}
              </div>
              {nextStage && (
                <div style={{ fontSize: 13, marginBottom: 6, opacity: 0.7 }}>
                  Next: {nextStage.description} ({nextStage.goal} {a.skillCriteria.metric})
                </div>
              )}
              <ProgressBar percent={percent} color={colorObj.color} />
              <div style={{
                fontSize: 13,
                marginTop: 7,
                fontWeight: 600,
                color: "#444",
                letterSpacing: 0.2
              }}>
                {stageIdx + 1}/{a.stages.length} Stages
              </div>
              {a.isCustom && (
                <div style={{
                  position: "absolute",
                  bottom: 5, right: 13,
                  fontSize: 11,
                  color: "#6b6b6b"
                }}>Custom</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}