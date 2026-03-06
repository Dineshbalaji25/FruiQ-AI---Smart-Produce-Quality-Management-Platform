import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Scan } from './pages/Scan';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/batch" element={<div className="p-8">Batch Processing Coming Soon</div>} />
          <Route path="/about" element={<div className="p-8">About FruiQ AI</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
