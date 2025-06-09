import type { SkillNode } from "../data/skills";
import { skillTree } from "../data/skills";

function findAllSkills(node: SkillNode): SkillNode[] {
  let arr: SkillNode[] = [node];
  if (node.children) node.children.forEach((child: SkillNode) => arr = arr.concat(findAllSkills(child)));
  return arr;
}

export function exportAllSkillData(): string {
  const allSkills = findAllSkills(skillTree);
  const data = allSkills.map((skill: SkillNode) => {
    const id = skill.id;
    return {
      id,
      level: Number(localStorage.getItem(`skill-level-${id}`)) || 0,
      xp: Number(localStorage.getItem(`skill-xp-${id}`)) || 0,
      note: localStorage.getItem(`skill-note-${id}`) || "",
      favorite: localStorage.getItem(`skill-favorite-${id}`) === "1",
      links: (() => { try { return JSON.parse(localStorage.getItem(`skill-links-${id}`) || "[]"); } catch { return []; } })(),
      tags: (() => { try { return JSON.parse(localStorage.getItem(`skill-tags-${id}`) || "[]"); } catch { return []; } })(),
    };
  });
  return JSON.stringify(data, null, 2);
}

export function importAllSkillData(json: string): void {
  const arr: any[] = JSON.parse(json);
  arr.forEach((skill: any) => {
    const { id, level, xp, note, favorite, links, tags } = skill;
    localStorage.setItem(`skill-level-${id}`, String(level || 0));
    localStorage.setItem(`skill-xp-${id}`, String(xp || 0));
    if (note) localStorage.setItem(`skill-note-${id}`, note); else localStorage.removeItem(`skill-note-${id}`);
    if (favorite) localStorage.setItem(`skill-favorite-${id}`, "1"); else localStorage.removeItem(`skill-favorite-${id}`);
    if (links && links.length) localStorage.setItem(`skill-links-${id}`, JSON.stringify(links)); else localStorage.removeItem(`skill-links-${id}`);
    if (tags && tags.length) localStorage.setItem(`skill-tags-${id}`, JSON.stringify(tags)); else localStorage.removeItem(`skill-tags-${id}`);
  });
}