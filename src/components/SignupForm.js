import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from './PatientForm';
import DoctorForm from './DoctorForm';
import '../css/custom.css';
import Divider from './Divider';

function SignupForm() {

    const [formState, setFormState] = useState('patient');
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('user_info');

    useEffect(() => {
      if (isLoggedIn) {
        navigate('/dashboard');
      }
    }, []);

    function setFormToDoctor() {
        setFormState('doctor');
    }

    function setFormToPatient() {
        setFormState('patient');
    }
    
    return (
        <>
            <div className="switch-registration">

                <p>Register as</p>
                <div className='form-btns'>
                    <button
                        className={`form-btn ${formState === 'patient' ? 'active-form-btn' : ''}`}
                        onClick={setFormToPatient} >
                        Patient
                    </button>
                    <button
                        className={`form-btn ${formState === 'doctor' ? 'active-form-btn' : ''}`}
                        onClick={setFormToDoctor} >
                        Doctor
                    </button>
                </div>

                
            </div>

            <Divider />

            {formState === 'patient' ? <PatientForm/> : <DoctorForm/>}
        </>
    )
}

export default SignupForm;