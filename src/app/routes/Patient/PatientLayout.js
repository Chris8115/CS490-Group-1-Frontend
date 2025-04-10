//import { Outlet } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import PatientAppointmentBooking from "./PatientAppointmentBooking";
import PatientReview from "./PatientReview";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";

function PatientLayout() {
    return <>
        <BetterUNavbar/>

        <div style={{margin: 'auto', width: '50%', padding: '1%'}}>
            <Routes>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="/" element={<PatientDashboard />} />
                <Route path="book-appointment" element={<PatientAppointmentBooking />} />
                <Route path="review" element={<PatientReview />} />
            </Routes>
        </div>

        <Divider />
        <Footer />

    </>
}

export default PatientLayout;