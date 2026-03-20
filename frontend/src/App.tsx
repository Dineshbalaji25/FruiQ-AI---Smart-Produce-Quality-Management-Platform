import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/batch" element={<BatchProcess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/detect-rotten-fruits" element={<DetectRottenFruits />} />
            <Route path="/fruit-freshness-checker" element={<FruitFreshnessChecker />} />
            <Route path="/formalin-detection-fruits" element={<FormalinDetection />} />
          </Routes>
        </Layout>
      </Router>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
