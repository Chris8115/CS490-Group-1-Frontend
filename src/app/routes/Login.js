import { React } from 'react';
import BetterUNavbar from '../../components/BetterUNavbar';
import Footer from '../../components/Footer';
import LoginForm from '../../components/LoginForm';
import Divider from '../../components/Divider';

function Login() {
    return (
        <>
            <BetterUNavbar/>

            <LoginForm/>
            
            <Divider/>

            <Footer/>
        </>
    )
}

export default Login;