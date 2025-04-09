import 'bootstrap/dist/css/bootstrap.min.css'
import Testing from './routes/Testing.js';
import Landing from './routes/Landing.js';
import Registration from './routes/Registration.js';
import Login from './routes/Login.js';
import React from 'react';
import { BrowserRouter, Router, Route, Link, Routes } from 'react-router-dom';
import { Axios } from 'axios';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/home" element={<Landing/>}/>
          <Route path="/sign-up" element={<Registration/>}/>
          <Route path="/log-in" element={<Login/>}></Route>
        </Routes>
      </BrowserRouter>
      
      </div>
  );
}

export default App;
