
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Testimonies from './pages/Testimonies';
import ApplyNow from './pages/ApplyNow';
import Privacy from './pages/Privacy';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonies" element={<Testimonies />} />
          <Route path="/apply" element={<ApplyNow />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
