import React, { useState } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';
import Eula from './Eula';
import { useNavigate } from 'react-router-dom';

function DoctorForm() {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            password: ''
        });
    const handleFileChange = (e) => {
        setFormMeta(prev => ({
            ...prev,
            identificationFile: e.target.files[0]
        }));
    };
    const [formMeta, setFormMeta] = useState({
            date: '',
            eulaName: '',
            identificationFile: null
        });
    const [doctorsData, setDoctorsData] = useState({
        license_number: '',
        specialization: '',
        profile: ''
    });
    

    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        const date = `${year}-${month}-${day}`;
        return String(date);
    }

    const handleChange = (e, stateSetter) => {
        const { name, value } = e.target;
        stateSetter(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', JSON.stringify({
            ...userData,
            role: 'doctor'
        }));
        
        formData.append('doctor', JSON.stringify(doctorsData));
        formData.append('patient', ''); // empty for patients
        formData.append('pharmacist', ''); // empty for patients

        if (formMeta.identificationFile) {
            formData.append('identification', formMeta.identificationFile);
        }

        try {
            const res = await fetch('http://localhost:5000/users/doctor', {
                method: 'POST',
                body: formData
            });

            const result = await res.json();
            
            navigate('/dashboard');


        } catch (err) {
            console.error(err);
            alert('Registration failed.');
        }
    };

    return (
        <div className='patient-form'>
            <h2>Register as a doctor</h2>
            <form onSubmit={handleSubmit}>
                <p className='step'>Step 1: Basic Information</p>
                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <label>First name</label>
                            <input className='form-input' name="first_name" value={userData.first_name} onChange={e => handleChange(e, setUserData)} />
                        </MDBCol>
                        <MDBCol>
                            <label>Last name</label>
                            <input className='form-input' name="last_name" value={userData.last_name} onChange={e => handleChange(e, setUserData)} />
                        </MDBCol>
                        </MDBRow>
                        <MDBRow className='mb-4'>
                            <MDBCol>
                                <label>Email Address</label>
                                <input className='form-input' name="email" type='email' value={userData.email} onChange={e => handleChange(e, setUserData)} />
                            </MDBCol>
                            <MDBCol>
                                <label>Phone Number</label>
                                <input className='form-input' name="phone_number" type='text' value={userData.phone_number} onChange={e => handleChange(e, setUserData)} />
                            </MDBCol>
                        </MDBRow>
                            <label>Password</label>
                            <input className='form-input' name="password" type='password' value={userData.password} onChange={e => handleChange(e, setUserData)} />
                            <label>Confirm Password</label>
                            <input className='form-input' type='password' />

                    <label>Write a short bio of your experience in medical practice. This will be publicly displayed on your profile. You may change this later.</label>
                    <input className='form-input' type='text' name='profile' value={doctorsData.profile} onChange={e => handleChange(e, setDoctorsData)} />

                    <label>Please enter your medical specialization(s) below.</label>
                    <input className='form-input' type='text' name='specialization' value={doctorsData.specialization} onChange={e => handleChange(e, setDoctorsData)} />

                    <p className='step'>Step 2: Identification, Address & Payment Info</p>

                    <label className="form-label">Upload Identification</label>
                    <input type="file" className="form-control mb-3" onChange={handleFileChange} />

                    <br></br>
                    <label class="form-label" for="customFile">Enter Medical License Code</label>
                    <input className='form-input' type='text' name='license_number' value={doctorsData.license_number} onChange={e => handleChange(e, setDoctorsData)} />
                    

                    <p className='step'>Step 3: Acknowledgement and Compliance Forms</p>
                    <Eula />

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <label>Name</label>
                            <input className='form-input' name='eulaName' value={formMeta.eulaName} onChange={e => handleChange(e, setFormMeta)} />
                        </MDBCol>
                        <MDBCol>
                            <label>Today's Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={formMeta.date}
                                min={getTomorrow()}
                                onChange={e => handleChange(e, setFormMeta)}
                                required />
                        </MDBCol>
                    </MDBRow>

                    <button type='submit' className='register-btn' >
                        Register
                    </button>
                

            </form>
        </div>
    );
}

export default DoctorForm;