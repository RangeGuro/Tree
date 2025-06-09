import { getAllSkills } from "./treeUtils";
import { skillTree } from "../data/skills";
import type { SkillNode } from "../data/skills";

/**
 * Returns a map of skillId to { level, xp } for all user skills.
 * Includes built-in and custom skills.
 */
export function getUserSkills(): Record<string, { level: number; xp: number }> {
  const allSkills: SkillNode[] = getAllSkills(skillTree);
  const skills: Record<string, { level: number; xp: number }> = {};
  for (const skill of allSkills) {
    const level = Number(localStorage.getItem(`skill-level-${skill.id}`)) || 0;
    const xp = Number(localStorage.getItem(`skill-xp-${skill.id}`)) || 0;
    skills[skill.id] = { level, xp };
  }
  // Add custom skills (user-defined)
  try {
    const customSkills = JSON.parse(localStorage.getItem("customSkills") || "[]");
    for (const entry of customSkills) {
      const skill = entry.skill;
      const level = Number(localStorage.getItem(`skill-level-${skill.id}`)) || 0;
      const xp = Number(localStorage.getItem(`skill-xp-${skill.id}`)) || 0;
      skills[skill.id] = { level, xp };
    }
  } catch {}
  return skills;
}

/**
 * Set the user's skill level for a given skill id.
 */
export function setUserSkillLevel(skillId: string, level: number) {
  localStorage.setItem(`skill-level-${skillId}`, String(level));
}

/**
 * Set the user's skill XP for a given skill id.
 */
export function setUserSkillXp(skillId: string, xp: number) {
  localStorage.setItem(`skill-xp-${skillId}`, String(xp));
}

/**
 * Add a custom skill to the user's skill list.
 */
export function addCustomSkill(skill: SkillNode) {
  let customSkills: any[] = [];
  try {
    customSkills = JSON.parse(localStorage.getItem("customSkills") || "[]");
  } catch {}
  customSkills.push({ skill });
  localStorage.setItem("customSkills", JSON.stringify(customSkills));
}

/**
 * Remove a custom skill by id.
 */
export function removeCustomSkill(skillId: string) {
  let customSkills: any[] = [];
  try {
    customSkills = JSON.parse(localStorage.getItem("customSkills") || "[]");
  } catch {}
  customSkills = customSkills.filter((entry: any) => entry.skill.id !== skillId);
  localStorage.setItem("customSkills", JSON.stringify(customSkills));
  localStorage.removeItem(`skill-level-${skillId}`);
  localStorage.removeItem(`skill-xp-${skillId}`);
}