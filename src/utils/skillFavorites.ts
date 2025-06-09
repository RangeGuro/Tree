export function isSkillFavorite(skillId: string): boolean {
  return localStorage.getItem(`skill-favorite-${skillId}`) === "1";
}

export function setSkillFavorite(skillId: string, favored: boolean) {
  if (favored) {
    localStorage.setItem(`skill-favorite-${skillId}`, "1");
  } else {
    localStorage.removeItem(`skill-favorite-${skillId}`);
  }
}