//import { Outlet } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import Divider from "../../../components/Divider";
import '../../../css/dashboard.css';
import { Outlet } from "react-router-dom";
import PharmacyNavbar from "../../../components/PharmacyNavbar";
import PharmacyFooter from '../../../components/PharmacyFooter';
import { MDBContainer } from "mdb-react-ui-kit";

function PharmacyLayout() {
    return <>
            <PharmacyNavbar />
            
            <MDBContainer className="p-3 my-5 d-flex flex-column w-100">
                <div>
                    <Outlet /> {/* Renders the matching route */}
                </div>
            </MDBContainer>

            <Divider />
            <PharmacyFooter />

    </>
}

export default PharmacyLayout;