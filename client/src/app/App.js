import 'bootstrap/dist/css/bootstrap.min.css'
import Testing from './routes/Testing.js';
import Landing from './routes/Landing.js';
import PatientLayout from './routes/Patient/PatientLayout.js';
import React from 'react';
import { BrowserRouter, Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/testing" element={<Testing/>}/>
          <Route path="/patient/*" element={<PatientLayout />} />
          
        </Routes>
      </BrowserRouter>
      
      </div>
  );
}

export default App;
