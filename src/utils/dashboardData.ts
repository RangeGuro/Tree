// Define a type for a Skill
export type Skill = {
  name: string;
  level: number;
  xp: number;
  tags?: string[];
};

// Replace these stubs with real data hooks or logic from your store/backend

export function getAllSkills(): Skill[] {
  return [
    { name: "Punch", level: 12, xp: 1200, tags: ["striking"] },
    { name: "Kick", level: 9, xp: 950, tags: ["striking"] },
    { name: "Grapple", level: 7, xp: 700, tags: ["grappling"] }
  ];
}

export function getTotalXP(skills: Skill[]): number {
  return skills.reduce((sum: number, s: Skill) => sum + (s.xp || 0), 0);
}

export function getCurrentStreak(): number {
  return 7; // mock, days active in a row
}

export function getTodayProgress(): { percent: number; xp: number; details: string } {
  return { percent: 75, xp: 120, details: "Practiced striking" };
}

export type Activity = {
  type: string;
  detail: string;
  date: string;
};

export function getRecentActivity(): Activity[] {
  return [
    { type: "Skill Leveled Up", detail: "Punch → Level 12", date: "2025-06-09" },
    { type: "Achievement", detail: "Unlocked: Shadowboxer", date: "2025-06-08" },
    { type: "Note Added", detail: "Kick: Improved flexibility routine", date: "2025-06-08" }
  ];
}