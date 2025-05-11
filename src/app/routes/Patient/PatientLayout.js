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
import { MDBContainer } from "mdb-react-ui-kit";

function PatientLayout() {
    return <>
            <BetterUNavbar />
            
            <MDBContainer className="p-3 my-5 d-flex flex-column w-100">
                <div>
                    <Outlet /> {/* Renders the matching route */}
                </div>
            </MDBContainer>

            <Divider />
            <Footer />

    </>
}

export default PatientLayout;