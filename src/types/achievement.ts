export interface Achievement {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  requirements: string[];
}