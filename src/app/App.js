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
import ResetPassword from './routes/ResetPassword.js';
import PatientAppointmentBooking from './routes/Patient/PatientAppointmentBooking.js';
import PatientReview from './routes/Patient/PatientReview.js';
import PatientProgress from './routes/Patient/PatientProgress.js';
import '../css/patient_pages.css'
import PatientDashboard from './routes/Patient/PatientDashboard.js';
import PatientPrescriptions from "./routes/Patient/PatientPrescriptions.js"
import DoctorDashboard from './routes/Doctor/DoctorDashboard.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/testing" element={<Testing/>}/>
          
          <Route path="/home" element={<Landing/>}/>
          <Route path="/sign-up" element={<Registration/>}/>
          <Route path="/log-in" element={<Login/>}></Route>
          <Route path="/resetpassword" element={<ResetPassword/>}></Route>
          <Route path="/log-in" element={<Login/>} ></Route>
          <Route path="/post/:postId" element={<PostPage />} ></Route>

          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/forums" element={<Forums/>}></Route>

          <Route path="/view_patients" element={<DoctorPatientView />} />
          <Route path="/settings" element={<DoctorSettings />} />
        
          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="book-appointment" element={<PatientAppointmentBooking />} />
            <Route path="review" element={<PatientReview />} />
            <Route path="progress" element={<PatientProgress />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
          </Route>

          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="view-patients" element={<DoctorPatientView />} />
            <Route path="settings" element={<DoctorSettings />} />
          </Route>

        </Routes>
      </BrowserRouter>
      
      </div>
  );
}

export default App;
