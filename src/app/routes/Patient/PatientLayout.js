//import { Outlet } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import PatientAppointmentBooking from "./PatientAppointmentBooking";
import PatientReview from "./PatientReview";
import PatientProgress from "./PatientProgress";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";
import '../../../css/dashboard.css';

function PatientLayout() {
    return <>
        <BetterUNavbar/>

        <div className="dashboard">
                <Routes>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="/" element={<PatientDashboard />} />
                    <Route path="book-appointment" element={<PatientAppointmentBooking />} />
                    <Route path="review" element={<PatientReview />} />
                    <Route path="progress" element={<PatientProgress />} />
                </Routes>
        </div>

        <Divider />
        <Footer />

    </>
}

export default PatientLayout;