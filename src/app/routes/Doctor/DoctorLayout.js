//import { Outlet } from "react-router-dom";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import Footer from "../../../components/Footer";
import '../../../css/dashboard.css';
import { Outlet } from "react-router-dom";
import { MDBContainer } from "mdb-react-ui-kit";

function DoctorLayout() {
    return <>
            <BetterUNavbar />
            
            <MDBContainer className="p-3 my-5 d-flex flex-column w-100"> 
                <div>
                    <Outlet />
                </div>
            </MDBContainer> 

            <Divider />
            <Footer />

    </>
}

export default DoctorLayout;