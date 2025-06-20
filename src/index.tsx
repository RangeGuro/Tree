export interface Achievement {
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  requirements: { skillId?: string; minLevel?: number }[];
}