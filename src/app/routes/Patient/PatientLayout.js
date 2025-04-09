import { Outlet } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { BrowserRouter, Router, Route, Link, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";

function PatientLayout() {
    return <>
        <BetterUNavbar/>

        <Routes >
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="/" element={<PatientDashboard />} />
        </Routes>

        <Divider />
        <Footer />

    </>
}

export default PatientLayout;