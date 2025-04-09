import React from 'react';
import { useState } from 'react';
import PatientForm from './PatientForm';
import DoctorForm from './DoctorForm';
import '../css/custom.css';
import Divider from './Divider';

function SignupForm() {
    const [formState, setFormState] = useState('patient');

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
                    <button className="form-btn" onClick={setFormToPatient}>Patient</button>
                    <button className="form-btn" onClick={setFormToDoctor}>Doctor</button>
                </div>
                
            </div>

            <Divider />

            {formState === 'patient' ? <PatientForm/> : <DoctorForm/>}
        </>
    )
}

export default SignupForm;