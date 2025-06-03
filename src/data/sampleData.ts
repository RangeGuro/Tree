import type { SkillNode, Achievement, Quest } from "../types";
import { v4 as uuidv4 } from "uuid";

export const sampleSkillTree: SkillNode[] = [
  {
    id: "root",
    name: "Martial Arts Fundamentals",
    description: "Start your martial arts journey.",
    level: 1,
    maxLevel: 1,
    youtubeUrl: "https://www.youtube.com/watch?v=sample",
    guide: ["Learn basic stance", "Understand discipline"],
    parents: [],
    children: ["jab", "stance"],
    position: { angle: 0, radius: 0 }
  },
  {
    id: "jab",
    name: "Jab",
    description: "Quick straight punch from the lead hand.",
    level: 0,
    maxLevel: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=JabTutorial",
    guide: ["Keep elbow in", "Snap punch", "Retract fast"],
    parents: ["root"],
    children: ["cross"],
    position: { angle: 0, radius: 120 }
  },
  {
    id: "cross",
    name: "Cross",
    description: "Powerful straight punch from the rear hand.",
    level: 0,
    maxLevel: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=CrossTutorial",
    guide: ["Rotate hips", "Follow through"],
    parents: ["jab"],
    children: ["jab_cross_combo"],
    position: { angle: 20, radius: 220 }
  },
  {
    id: "stance",
    name: "Stance",
    description: "Stable fighting stance.",
    level: 0,
    maxLevel: 3,
    youtubeUrl: "https://www.youtube.com/watch?v=StanceTutorial",
    guide: ["Feet shoulder width", "Knees slightly bent"],
    parents: ["root"],
    children: [],
    position: { angle: 120, radius: 120 }
  },
  {
    id: "jab_cross_combo",
    name: "Jab + Cross Combo",
    description: "Combine jab and cross for a basic combo.",
    level: 0,
    maxLevel: 3,
    youtubeUrl: "https://www.youtube.com/watch?v=ComboTutorial",
    guide: ["Throw jab then cross", "Keep guard up"],
    parents: ["cross"],
    children: [],
    position: { angle: 30, radius: 320 }
  }
];

export const sampleAchievements: Achievement[] = [
  {
    id: "first_level",
    name: "First Step",
    description: "Level up any skill for the first time.",
    level: 0,
    maxLevel: 1,
    requirements: [{ skillId: "jab", minLevel: 1 }]
  },
  {
    id: "combo_master",
    name: "Combo Master",
    description: "Reach max level on Jab + Cross Combo.",
    level: 0,
    maxLevel: 1,
    requirements: [{ skillId: "jab_cross_combo", minLevel: 3 }]
  }
];

export const sampleQuests: Quest[] = [
  {
    id: uuidv4(),
    title: "Practice Jab",
    description: "Reach level 3 in Jab.",
    type: "daily",
    status: "not started",
    requirements: [{ skillId: "jab", minLevel: 3 }],
    progress: 0,
    reward: "50 XP"
  },
  {
    id: uuidv4(),
    title: "Master Combo",
    description: "Reach max level on Jab + Cross Combo.",
    type: "weekly",
    status: "not started",
    requirements: [{ skillId: "jab_cross_combo", minLevel: 3 }],
    progress: 0,
    reward: "100 XP"
  }
];