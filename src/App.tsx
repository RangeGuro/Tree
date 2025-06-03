import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import SkillTreePage from "./pages/SkillTreePage";
import AchievementsPage from "./pages/AchievementsPage";
import LearnedSkillsPage from "./pages/LearnedSkillsPage";
import QuestsPage from "./pages/QuestsPage";
import { SkillTreeProvider } from "./context/SkillTreeContext";

const App = () => (
  <SkillTreeProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/skill-tree" element={<SkillTreePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/learned-skills" element={<LearnedSkillsPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="*" element={<div style={{padding: "2em"}}>404 - Page not found</div>} />
      </Routes>
    </BrowserRouter>
  </SkillTreeProvider>
);

export default App;