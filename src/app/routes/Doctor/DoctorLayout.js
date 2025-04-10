//import { Outlet } from "react-router-dom";
import DoctorDashboard from "./DoctorDashboard";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";

function DoctorLayout() {
    return (
        <>
            <BetterUNavbar/>
            
            <DoctorDashboard />

            <Divider />
            <Footer />

        </>
    )
}

export default DoctorLayout;