import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Scan } from './pages/Scan';
import { Dashboard } from './pages/Dashboard';
import { BatchProcess } from './pages/BatchProcess';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

import { Analytics } from "@vercel/analytics/react";

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
          </Routes>
        </Layout>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
