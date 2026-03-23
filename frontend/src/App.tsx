import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingLayout } from './components/layout/LandingLayout';
import { Home } from './pages/Home';
import { Scan } from './pages/Scan';
import { Dashboard } from './pages/Dashboard';
import { BatchProcess } from './pages/BatchProcess';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { DetectRottenFruits } from './pages/DetectRottenFruits';
import { FruitFreshnessChecker } from './pages/FruitFreshnessChecker';
import { FormalinDetection } from './pages/FormalinDetection';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* All routes use LandingLayout (Navbar + Footer) */}
          <Route path="/" element={<LandingLayout><Dashboard /></LandingLayout>} />
          <Route path="/scan" element={<LandingLayout><Scan /></LandingLayout>} />
          <Route path="/batch" element={<LandingLayout><BatchProcess /></LandingLayout>} />

          <Route path="/home" element={<LandingLayout><Home /></LandingLayout>} />
          <Route path="/about" element={<LandingLayout><About /></LandingLayout>} />
          <Route path="/contact" element={<LandingLayout><Contact /></LandingLayout>} />
          <Route path="/blog" element={<LandingLayout><Blog /></LandingLayout>} />
          <Route path="/detect-rotten-fruits" element={<LandingLayout><DetectRottenFruits /></LandingLayout>} />
          <Route path="/fruit-freshness-checker" element={<LandingLayout><FruitFreshnessChecker /></LandingLayout>} />
          <Route path="/formalin-detection-fruits" element={<LandingLayout><FormalinDetection /></LandingLayout>} />
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
