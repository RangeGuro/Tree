export interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  youtubeUrl?: string;
  guide?: string[];
  parents: string[];
  children: string[];
  position: { angle: number; radius: number }; // for radial layout
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  requirements: { skillId?: string; minLevel?: number }[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "other";
  status: "not started" | "in progress" | "finished";
  requirements: { skillId?: string; minLevel?: number; achievementId?: string; minAchLevel?: number }[];
  progress: number; // 0-1
  reward: string;
}

export interface Stats {
  [attribute: string]: number;
}

export interface ComboGuide {
  id: string;
  name: string;
  skills: string[];
  guide: string;
}