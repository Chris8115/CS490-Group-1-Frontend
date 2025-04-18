import { React } from 'react';
import BetterUNavbar from '../../components/BetterUNavbar';
import Footer from '../../components/Footer';
import Divider from '../../components/Divider';
import ResetPasswordForm from '../../components/ResetPasswordForm';

function ResetPassword() {
    return (
        <>
            <BetterUNavbar/>

            <ResetPasswordForm/>
            
            <Divider/>

            <Footer/>
        </>
    )
}

export default ResetPassword;