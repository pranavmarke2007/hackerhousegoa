import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import MobileNav from './components/common/MobileNav';
import CommandPalette from './components/common/CommandPalette';

import Dashboard from './pages/Dashboard';
import College from './pages/College';
import Habits from './pages/Habits';
import Skills from './pages/Skills';
import Goals from './pages/Goals';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function AppLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Main App Work Area */}
      <div className="main-content">
        <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/college" element={<College />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Mobile Navigation Bar */}
        <MobileNav />
      </div>

      {/* Global Command Palette (Cmd/Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onQuickAction={(action) => {
          if (action === 'open_palette') setIsCommandPaletteOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
