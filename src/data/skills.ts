// Define the SkillNode interface and skillTree placeholder data

export interface SkillNode {
  id: string;
  name: string;
  level: number; // User's current progress, always starts at 0
  minLevel?: number; // Minimum required level in parent to unlock (optional)
  maxLevel?: number; // Maximum achievable level (optional)
  children?: SkillNode[];
  description?: string;
  guide?: string[];
  youtubeUrl?: string;
  tags?: string[]; // <-- For search/filter support
}

// Example skill tree data with rich content and tags for some nodes
export const skillTree: SkillNode = {
  id: "foundation",
  name: "🧭 Foundation",
  level: 0,
  description: "The starting point for your journey. Master these core skills to unlock advanced paths.",
  guide: [
    "Complete all foundational tasks.",
    "Review each basic concept.",
    "Reach at least level 3 in each."
  ],
  tags: ["core", "beginner", "essential"],
  children: [
    {
      id: "html",
      name: "HTML Basics",
      level: 0,
      description: "Learn the basics of HyperText Markup Language (HTML).",
      youtubeUrl: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
      guide: [
        "Understand the structure of an HTML document.",
        "Practice writing headings, paragraphs, and lists.",
        "Learn about links and images."
      ],
      tags: ["markup", "web", "frontend", "beginner"],
      children: [
        {
          id: "forms",
          name: "HTML Forms",
          level: 0,
          minLevel: 2,
          description: "Learn how to collect user input using HTML forms.",
          youtubeUrl: "https://www.youtube.com/watch?v=fNcJuPIZ2WE",
          guide: [
            "Create a basic form.",
            "Add inputs for text, password, and email.",
            "Understand form submission."
          ],
          tags: ["forms", "input", "web", "html"]
        }
      ]
    },
    {
      id: "css",
      name: "CSS Fundamentals",
      level: 0,
      description: "Master the basics of Cascading Style Sheets (CSS).",
      youtubeUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
      guide: [
        "Learn about selectors and properties.",
        "Practice styling text, backgrounds, and borders.",
        "Understand the box model."
      ],
      tags: ["css", "styling", "frontend", "design"]
    },
    {
      id: "js",
      name: "JavaScript Essentials",
      level: 0,
      description: "Grasp the core concepts of JavaScript programming.",
      youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      guide: [
        "Learn about variables and data types.",
        "Write basic functions.",
        "Understand control flow (if/else, loops)."
      ],
      tags: ["javascript", "programming", "frontend", "logic"]
    }
  ]
};