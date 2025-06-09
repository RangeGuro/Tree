import "./Landing.css";
import { useSkillTree } from "../context/SkillTreeContext";
import TotalProgressBar from "../components/TotalProgressBar";
import PentagonStats from "../components/PentagonStats";
import AchievementModal from "../components/AchievementModal";
import type { SkillNode, Achievement, Quest } from "../types";

// MOTIVATIONAL QUOTES
const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" }
];
const quoteOfTheDay = quotes[Math.floor(Math.random() * quotes.length)];

// --- FEATURE HIGHLIGHTS ---
const featureList = [
  {
    icon: "/icons/tree.svg",
    title: "Skill Tree",
    desc: "Visualize your progress and unlock new martial arts techniques step by step.",
    to: "/skill-tree"
  },
  {
    icon: "/icons/quest.svg",
    title: "Quests",
    desc: "Complete personalized challenges to level up and earn rewards.",
    to: "/quests"
  },
  {
    icon: "/icons/trophy.svg",
    title: "Achievements",
    desc: "Track your progress and collect unique badges on your journey.",
    to: "/achievements"
  },
  {
    icon: "/icons/community.svg",
    title: "Community",
    desc: "Share your progress and compete with friends.",
    to: "/community"
  }
];

// --- DASHBOARD HELPERS ---
function getTopSkills(skills: SkillNode[]): SkillNode[] {
  const maxLvl = Math.max(...skills.map(s => s.level), 0);
  return skills.filter(s => s.level === maxLvl);
}

function getTotalXP(skills: SkillNode[]): number {
  // Example: 100 XP per skill level
  return skills.reduce((acc, s) => acc + (s.level * 100), 0);
}

function getRecentAchievements(achievements: Achievement[]): Achievement[] {
  // Show up to 3 most recently completed
  return [...achievements].sort((a, b) => b.level - a.level).slice(0, 3);
}

function getActiveQuests(quests: Quest[]): Quest[] {
  return quests.filter(q => q.status !== "finished").slice(0, 2);
}

function getStreak(): number {
  // Read from localStorage or compute from activity in real app
  const streak = Number(localStorage.getItem("current-streak")) || 0;
  return streak;
}

function getRecentActivity(skills: SkillNode[], achievements: Achievement[], quests: Quest[]): { type: string; detail: string; date: string }[] {
  // Sample: most recent 5 events, naive implementation
  const activity: { type: string; detail: string; date: string }[] = [];
  // Add recent leveled up skills
  skills.forEach(s => {
    if (s.level > 0) {
      activity.push({
        type: "Skill",
        detail: `Leveled up ${s.name} to ${s.level}`,
        date: "Today" // Replace with real timestamps if available
      });
    }
  });
  // Add completed achievements
  achievements.forEach(a => {
    if (a.level === a.maxLevel) {
      activity.push({
        type: "Achievement",
        detail: `Completed ${a.name}`,
        date: "Today"
      });
    }
  });
  // Add quest progress
  quests.forEach(q => {
    if (q.status === "finished") {
      activity.push({
        type: "Quest",
        detail: `Completed quest "${q.title}"`,
        date: "Today"
      });
    }
  });
  // Sort, limit to 5
  return activity.slice(0, 5);
}

const DashboardStat = ({
  label,
  value,
  icon
}: {
  label: string;
  value: string | number;
  icon: string;
}) => (
  <div className="dashboard-stat">
    <span className="dashboard-stat-icon">{icon}</span>
    <div>
      <span className="dashboard-stat-label">{label}</span>
      <span className="dashboard-stat-value">{value}</span>
    </div>
  </div>
);

const Landing = () => {
  const { skills, achievements, quests } = useSkillTree();

  const topSkills = getTopSkills(skills);
  const totalXP = getTotalXP(skills);
  const streak = getStreak();

  // Reuse TotalProgressBar for % complete
  // Get recent achievements and quests for dashboard cards
  const recentAchievements = getRecentAchievements(achievements);
  const activeQuests = getActiveQuests(quests);

  const recentActivity = getRecentActivity(skills, achievements, quests);

  return (
    <div className="landing">
      <h1>
        <span className="diamond-gradient-text">
          Welcome to Your Martial Arts Journey!
        </span>
      </h1>
      <p className="landing-lead">
        Track your progress, unlock new skills, and become your best self!
      </p>

      {/* DASHBOARD STATS */}
      <div className="dashboard-stats-row">
        <DashboardStat label="Skills Tracked" value={skills.length} icon="🗂️" />
        <DashboardStat label="Top Skill" value={topSkills.map(s => s.name).join(", ") || "-"} icon="🥇" />
        <DashboardStat label="Total XP" value={totalXP} icon="🏅" />
        <DashboardStat label="Streak" value={`${streak} days`} icon="🔥" />
      </div>

      {/* Total Progress Bar */}
      <TotalProgressBar />

      {/* Feature Highlights */}
      <div className="feature-highlights">
        {featureList.map(f => (
          <a href={f.to} key={f.title} className="feature-card feature-nav-card">
            <img src={f.icon} alt={f.title} className="feature-icon" />
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </a>
        ))}
      </div>

      {/* Recent Achievements */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {recentAchievements.map(a => (
          <AchievementCard achievement={a} key={a.id} />
        ))}
      </div>

      {/* Active Quests */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {activeQuests.map(q => (
          <div key={q.id} style={{
            background: "#2b3042",
            borderRadius: 10,
            padding: "1em 1.5em",
            minWidth: 250,
            flex: "1 0 250px",
            boxShadow: "0 2px 8px #0003"
          }}>
            <h5 style={{ color: "#2196f3" }}>{q.title}</h5>
            <div style={{ fontSize: 13, color: "#fff" }}>{q.description}</div>
            <div style={{ margin: "0.5em 0" }}>
              <div style={{ background: "#444", borderRadius: 7, height: 9 }}>
                <div
                  style={{
                    width: `${q.progress * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg,#fa5252,#ffd700,#4caf50,#2196f3)",
                    borderRadius: 7
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#ffdf58" }}>Reward: {q.reward}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="activity-feed">
        <h4>Recent Activity</h4>
        <ul>
          {recentActivity.length === 0 && <li>No recent activity yet.</li>}
          {recentActivity.map((a, i) => (
            <li key={i}>
              <span className="activity-type">{a.type}</span>: {a.detail}
              <span className="activity-date">{a.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Motivational Quote */}
      <div className="motivation-quote">
        <q>{quoteOfTheDay.text}</q>
        <span>– {quoteOfTheDay.author}</span>
      </div>

      <PentagonStats />
    </div>
  );
};

export default Landing;