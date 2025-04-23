import { React } from 'react';
import Footer from '../../../components/Footer';
import PharmacyLoginForm from '../../../components/PharmacyLoginForm';
import Divider from '../../../components/Divider';
import PharmacyNavbar from '../../../components/PharmacyNavbar';

function PharmacyLogin() {
    return (
        <>
            <PharmacyNavbar/>

            <PharmacyLoginForm/>
            
            <Divider/>

            <Footer/>
        </>
    )
}

export default PharmacyLogin;