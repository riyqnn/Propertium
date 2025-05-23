import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./home/LandingPage";
import Navbar from './component/Navbar';

function App() {
  return (
   <Router>
  {/* <Navbar /> */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  </Router>

  );
}

export default App;