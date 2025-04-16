import 'bootstrap/dist/css/bootstrap.min.css'
import Testing from './routes/Testing.js';
import Landing from './routes/Landing.js';
import Forums from './routes/Forums.js';
import PatientLayout from './routes/Patient/PatientLayout.js';
import DoctorLayout from './routes/Doctor/DoctorLayout.js';
import Registration from './routes/Registration.js';
import Login from './routes/Login.js';
import React from 'react';
import Dashboard from './routes/Dashboard.js';
import { BrowserRouter, Router, Route, Link, Routes } from 'react-router-dom';
import { Axios } from 'axios';
import DoctorPatientView from './routes/Doctor/DoctorPatientView.js';
import DoctorSettings from './routes/Doctor/DoctorSettings.js';
import PostPage from './routes/Forums/PostPage.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/testing" element={<Testing/>}/>
          
          <Route path="/home" element={<Landing/>}/>
          <Route path="/sign-up" element={<Registration/>}/>
          <Route path="/log-in" element={<Login/>} ></Route>
          <Route path="/post/:postId" element={<PostPage />} ></Route>

          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/forums" element={<Forums/>}></Route>

          <Route path="/view_patients" element={<DoctorPatientView />} />
          <Route path="/settings" element={<DoctorSettings />} />
        </Routes>
      </BrowserRouter>
      
      </div>
  );
}

export default App;
