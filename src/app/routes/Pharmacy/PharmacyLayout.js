//import { Outlet } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import '../../../css/dashboard.css';
import { Outlet } from "react-router-dom";
import PharmacyNavbar from "../../../components/PharmacyNavbar";
import PharmacyFooter from '../../../components/PharmacyFooter';

function PharmacyLayout() {
    return <>
            <PharmacyNavbar />
            
            <div className="patient_pages">
                <div>
                    <Outlet /> {/* Renders the matching route */}
                </div>
            </div>

            <Divider />
            <PharmacyFooter />

    </>
}

export default PharmacyLayout;