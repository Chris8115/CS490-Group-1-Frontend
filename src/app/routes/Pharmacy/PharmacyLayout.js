//import { Outlet } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";
import '../../../css/dashboard.css';
import { Outlet } from "react-router-dom";
import PharmacyNavbar from "../../../components/PharmacyNavbar";

function PharmacyLayout() {
    return <>
            <PharmacyNavbar />
            
            <div className="patient_pages">
                <div>
                    <Outlet /> {/* Renders the matching route */}
                </div>
            </div>

            <Divider />
            <Footer />

    </>
}

export default PharmacyLayout;