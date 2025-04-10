//import { Outlet } from "react-router-dom";
import DoctorDashboard from "./DoctorDashboard";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";
import '../../../css/dashboard.css';

function DoctorLayout() {
    return (
        <>
            <BetterUNavbar/>
            
            <div className="dashboard">
                <DoctorDashboard />
            </div>

            <Divider />
            <Footer />

        </>
    )
}

export default DoctorLayout;