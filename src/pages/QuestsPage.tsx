import React from "react";
import { useSkillTree } from "../context/SkillTreeContext";
import type { Quest } from "../types";

const QuestsPage: React.FC = () => {
  const { quests } = useSkillTree();
  const types: ("daily"|"weekly"|"other")[] = ["daily", "weekly", "other"];
  const statusTypes: ("not started"|"in progress"|"finished")[] = ["not started", "in progress", "finished"];

  return (
    <div style={{maxWidth: 900, margin: "2em auto", background: "#23283a", borderRadius: 16, padding: "2em"}}>
      <h2 style={{color: "#ffdf58"}}>Quests</h2>
      {types.map(type => (
        <div key={type}>
          <h3 style={{color: "#ffd700", marginTop: 18}}>{type.charAt(0).toUpperCase() + type.slice(1)} Quests</h3>
          {statusTypes.map(status => (
            <div key={status}>
              <h4 style={{color: "#4caf50", margin:"10px 0"}}>{status.replace(/^\w/, c => c.toUpperCase())}</h4>
              <div style={{display: "flex", flexWrap: "wrap", gap: 18}}>
                {quests.filter(q => q.type === type && q.status === status).map(q => (
                  <div key={q.id} style={{
                    background: "#2b3042",
                    borderRadius: 10,
                    padding: "1em 1.5em",
                    minWidth: 250,
                    flex: "1 0 250px",
                    boxShadow: "0 2px 8px #0003"
                  }}>
                    <h5 style={{color: "#2196f3"}}>{q.title}</h5>
                    <div style={{fontSize: 13, color: "#fff"}}>{q.description}</div>
                    <div style={{margin: "0.5em 0"}}>
                      <div style={{background: "#444", borderRadius: 7, height: 9}}>
                        <div
                          style={{
                            width: `${q.progress * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg,#fa5252,#ffd700,#4caf50,#2196f3)",
                            borderRadius: 7
                          }}
                        />
                      </div>
                    </div>
                    <div style={{fontSize: 13, color: "#ffdf58"}}>Reward: {q.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuestsPage;