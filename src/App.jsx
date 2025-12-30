import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MatrixBackground from './components/MatrixBackground';
import Home from './pages/Home';
import SecurityPortal from './pages/SecurityPortal';
import Careers from './pages/Careers';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-obsidian">
        <MatrixBackground />
        <Navbar />
        <main className="relative z-10 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portal" element={<SecurityPortal />} />
            <Route path="/careers" element={<Careers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
