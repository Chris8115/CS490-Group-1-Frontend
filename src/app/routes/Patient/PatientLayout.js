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
import { Outlet } from "react-router-dom";

function PatientLayout() {
    return <>
            <BetterUNavbar />
            
            <div className="patient_pages">
                <div>
                    <Outlet /> {/* Renders the matching route */}
                </div>
            </div>

            <Divider />
            <Footer />

    </>
}

export default PatientLayout;