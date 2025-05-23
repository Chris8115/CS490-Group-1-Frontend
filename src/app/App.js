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
import DoctorPatientInfo from './routes/Doctor/DoctorPatientInfo.js';
import DoctorPrescribe from './routes/Doctor/DoctorPrescribe.js';
import '../css/custom.css';

import PharmacyLayout from './routes/Pharmacy/PharmacyLayout.js';
import PharmacyDashboard from './routes/Pharmacy/PharmacyDashboard.js';
import PharmacyLogin from './routes/Pharmacy/PharmacyLogin.js';
import PharmacyPatientSearch from './routes/Pharmacy/PharmacyPatientSearch.js';
import PharmacyDeliveriesPage from './routes/Pharmacy/PharmacyDeliveriesPage.js';
import PharmacyProductRecords from './routes/Pharmacy/PharmacyProductRecords.js';
import PharmacyAddProduct from './routes/Pharmacy/PharmacyAddProduct.js';
import { refresh_user_info } from './UserContext.js';
import PatientTransactions from './routes/Patient/PatientTransactions.js';

function App() {
  refresh_user_info();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/testing" element={<Testing/>}/>
          
          <Route path="/home" element={<Landing/>}/>
          <Route path="/sign-up" element={<Registration/>}/>
          <Route path="/log-in" element={<Login/>} ></Route>
          <Route path="/resetpassword" element={<ResetPassword/>}></Route>
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
            <Route path="transactions" element={<PatientTransactions />} />
          </Route>

          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="view-patients" element={<DoctorPatientView />} />
            <Route path="settings" element={<DoctorSettings />} />
            <Route path="doctor_patient_info/:patient_id" element={<DoctorPatientInfo />} />
            <Route path="prescribe/:patient_id" element={<DoctorPrescribe />} />

          </Route>

          <Route path="/pharmacy-log-in" element={<PharmacyLogin/>}></Route>

          <Route path="/pharmacy" element={<PharmacyLayout />}>
            <Route path="dashboard" element={<PharmacyDashboard />} />
            <Route path="patient-search" element={<PharmacyPatientSearch />} />
            <Route path="deliveries" element={<PharmacyDeliveriesPage />} />
            <Route path="records" element={<PharmacyProductRecords />} />
            <Route path="add-product" element={<PharmacyAddProduct />} />
          </Route>
          

        </Routes>
      </BrowserRouter>
      
      </div>
  );
}

export default App;
