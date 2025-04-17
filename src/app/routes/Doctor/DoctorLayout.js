//import { Outlet } from "react-router-dom";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";
import '../../../css/dashboard.css';
import { Outlet } from "react-router-dom";

function DoctorLayout() {
    return <>
            <BetterUNavbar />
            
            <div>
                <div className="dashboard">
                    <Outlet /> {/* Renders the matching route */}
                </div>
            </div>

            <Divider />
            <Footer />

    </>
}

export default DoctorLayout;