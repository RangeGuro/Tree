export interface AchievementStage {
  name: string;
  description: string;
  goal: number; // numeric threshold (level, xp, etc)
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  stages: AchievementStage[]; // 1 or more
  skillCriteria: {
    skillId: string;
    metric: "level" | "xp";
  };
  isCustom?: boolean;
}

export const achievements: Achievement[] = [
  {
    id: "foundation_master",
    name: "Foundation Master",
    icon: "🧭",
    skillCriteria: { skillId: "foundation", metric: "level" },
    stages: [
      { name: "Bronze", description: "Reach Foundation level 1", goal: 1 },
      { name: "Silver", description: "Reach Foundation level 3", goal: 3 },
      { name: "Gold", description: "Reach Foundation level 5", goal: 5 }
    ]
  },
  {
    id: "html_expert",
    name: "HTML Expert",
    icon: "🌐",
    skillCriteria: { skillId: "html", metric: "level" },
    stages: [
      { name: "Bronze", description: "HTML level 1", goal: 1 },
      { name: "Silver", description: "HTML level 3", goal: 3 },
      { name: "Gold", description: "HTML level 5", goal: 5 }
    ]
  },
  {
    id: "css_wizard",
    name: "CSS Wizard",
    icon: "🎨",
    skillCriteria: { skillId: "css", metric: "level" },
    stages: [
      { name: "Bronze", description: "CSS level 1", goal: 1 },
      { name: "Silver", description: "CSS level 3", goal: 3 },
      { name: "Gold", description: "CSS level 5", goal: 5 }
    ]
  },
  {
    id: "js_ninja",
    name: "JS Ninja",
    icon: "⚡",
    skillCriteria: { skillId: "js", metric: "level" },
    stages: [
      { name: "Bronze", description: "JavaScript level 1", goal: 1 },
      { name: "Silver", description: "JavaScript level 3", goal: 3 },
      { name: "Gold", description: "JavaScript level 5", goal: 5 }
    ]
  }
];