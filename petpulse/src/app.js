import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './components/welcomepage'; 
import TherapyPage from './components/therapy'; 

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} /> {/* Use element prop */}
        <Route path="/therapy" element={<TherapyPage />} /> {/* Use element prop */}
      </Routes>
    </div>
  );
}

export default App;
