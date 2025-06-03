import React from "react";
import { useSkillTree } from "../context/SkillTreeContext";

function calcTotalProgress(skills: any[]) {
  const total = skills.reduce((sum, s) => sum + s.maxLevel, 0);
  const done = skills.reduce((sum, s) => sum + s.level, 0);
  return total === 0 ? 0 : done / total;
}

const TotalProgressBar: React.FC = () => {
  const { skills } = useSkillTree();
  const percent = Math.floor(calcTotalProgress(skills) * 100);

  return (
    <div style={{margin: "2em 0"}}>
      <div style={{fontWeight: "bold", color: "#ffdf58", marginBottom: 6}}>Total Progress: {percent}%</div>
      <div style={{background: "#444", borderRadius: 8, height: 20, width: "100%"}}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "linear-gradient(90deg,#fa5252,#ffd700,#4caf50,#2196f3)",
            borderRadius: 8
          }}
        />
      </div>
    </div>
  );
};

export default TotalProgressBar;