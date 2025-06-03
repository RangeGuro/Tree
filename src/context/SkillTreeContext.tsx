import React, { createContext, useContext, useEffect, useState } from "react";
import { sampleSkillTree, sampleAchievements, sampleQuests } from "../data/sampleData";
import type { SkillNode, Achievement, Quest } from "../types";
import { loadFromStorage, saveToStorage } from "../utils/storage";

interface SkillTreeContextType {
  skills: SkillNode[];
  setSkills: (skills: SkillNode[]) => void;
  achievements: Achievement[];
  setAchievements: (a: Achievement[]) => void;
  quests: Quest[];
  setQuests: (q: Quest[]) => void;
}

const SkillTreeContext = createContext<SkillTreeContextType | null>(null);

export const SkillTreeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [skills, setSkills] = useState<SkillNode[]>(
    loadFromStorage("skills") || sampleSkillTree
  );
  const [achievements, setAchievements] = useState<Achievement[]>(
    loadFromStorage("achievements") || sampleAchievements
  );
  const [quests, setQuests] = useState<Quest[]>(
    loadFromStorage("quests") || sampleQuests
  );

  // Persist to storage
  useEffect(() => {
    saveToStorage("skills", skills);
  }, [skills]);
  useEffect(() => {
    saveToStorage("achievements", achievements);
  }, [achievements]);
  useEffect(() => {
    saveToStorage("quests", quests);
  }, [quests]);

  return (
    <SkillTreeContext.Provider value={{ skills, setSkills, achievements, setAchievements, quests, setQuests }}>
      {children}
    </SkillTreeContext.Provider>
  );
};

export const useSkillTree = () => {
  const ctx = useContext(SkillTreeContext);
  if (!ctx) throw new Error("useSkillTree must be used within SkillTreeProvider");
  return ctx;
};