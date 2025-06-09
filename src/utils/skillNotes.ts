export function getSkillNote(skillId: string): string {
  return localStorage.getItem(`skill-note-${skillId}`) || "";
}

export function setSkillNote(skillId: string, note: string) {
  if (note.trim()) {
    localStorage.setItem(`skill-note-${skillId}`, note);
  } else {
    localStorage.removeItem(`skill-note-${skillId}`);
  }
}