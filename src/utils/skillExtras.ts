// Links: array of {title, url}
export function getSkillLinks(skillId: string): {title: string, url: string}[] {
  try {
    return JSON.parse(localStorage.getItem(`skill-links-${skillId}`) || "[]");
  } catch { return []; }
}
export function setSkillLinks(skillId: string, links: {title: string, url: string}[]) {
  localStorage.setItem(`skill-links-${skillId}`, JSON.stringify(links));
}

// Tags: array of string
export function getSkillTags(skillId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(`skill-tags-${skillId}`) || "[]");
  } catch { return []; }
}
export function setSkillTags(skillId: string, tags: string[]) {
  localStorage.setItem(`skill-tags-${skillId}`, JSON.stringify(tags));
}