import { React, useState, useEffect } from 'react';
import PatientLayout from './Patient/PatientLayout';
import DoctorLayout from './Doctor/DoctorLayout';
import { useNavigate } from 'react-router-dom';

function DashboardRedirect() {

    const navigate = useNavigate();
    const user_info = JSON.parse(sessionStorage.getItem('user_info'));
    let display;
    
    
    useEffect(() => {

        const isLoggedIn = !!sessionStorage.getItem('user_info');

        if (!isLoggedIn) {
            navigate('/log-in');
        }
    }, []);

    if (user_info?.role === 'patient') {
        display = <PatientLayout />;
    }
    else if (user_info?.role === 'doctor') {
        display = <DoctorLayout />;
    }
    else if (user_info?.role === 'pharmacist') {
        display = <p>Pharmacist dashboard</p>;
    }
    else {
        navigate('/log-in');
        display = <p>An error has occurred. Please try logging in again.</p>;
    }

    return (
        <>
            {display}
        </>
    )
}

export default DashboardRedirect;