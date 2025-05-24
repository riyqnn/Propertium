import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./home/LandingPage";
import Maps from "./pages/Maps"


function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/maps" element={<Maps />} />
    </Routes>
  </Router>

  );
}

export default App;