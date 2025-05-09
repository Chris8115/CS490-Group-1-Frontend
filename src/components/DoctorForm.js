import React, { useState } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';
import Eula from './Eula';
import { BACKEND_HOST, PHARMA_HOST } from './Hosts.js'
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

    const [addressData, setAddressData] = useState({
            address: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            zip: ''
        });
    const handleFileChange = (e) => {
        setFormMeta(prev => ({
            ...prev,
            identificationFile: e.target.files[0]
        }));
    };
    const handleFileChange2 = (e) => {
        setFormMeta(prev => ({
            ...prev,
            profileFile: e.target.files[0]
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
        profile: '',
        office: '',
        rate: ''
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

    const getToday = () => {
        const today = new Date();
        today.setDate(today.getDate());
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
        
        formData.append('address', JSON.stringify(addressData));
        formData.append('doctor', JSON.stringify(doctorsData));
        formData.append('patient', ''); // empty for patients
        formData.append('pharmacist', ''); // empty for patients

        if (formMeta.identificationFile) {
            formData.append('identification', formMeta.identificationFile);
        }
        if (formMeta.profileFile) {
            formData.append('profile_pic', formMeta.profileFile);
        }
        
        try {
            const res = await fetch(`/api/betteru/users/doctor`, {
                method: 'POST',
                body: formData
            });

            const result = await res.json();
            if(res.status == 201 || res.status == 200){
                navigate('/dashboard');
            } else {
                console.log(result.message)
                document.getElementById('responsetext').textContent = result['message'];
            }


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
                            <input required className='form-input' name="first_name" value={userData.first_name} onChange={e => handleChange(e, setUserData)} />
                        </MDBCol>
                        <MDBCol>
                            <label>Last name</label>
                            <input required className='form-input' name="last_name" value={userData.last_name} onChange={e => handleChange(e, setUserData)} />
                        </MDBCol>
                        </MDBRow>
                        <MDBRow className='mb-4'>
                            <MDBCol>
                                <label>Email Address</label>
                                <input required className='form-input' name="email" type='email' value={userData.email} onChange={e => handleChange(e, setUserData)} />
                            </MDBCol>
                            <MDBCol>
                                <label>Phone Number</label>
                                <input required className='form-input' name="phone_number" type='text' value={userData.phone_number} onChange={e => handleChange(e, setUserData)} />
                            </MDBCol>
                        </MDBRow>
                            <label>Password</label>
                            <input required className='form-input' name="password" type='password' value={userData.password} onChange={e => handleChange(e, setUserData)} />
                            <label>Confirm Password</label>
                            <input required className='form-input' type='password' />

                        <label className="form-label">Upload Profile Picture</label>
                        <input required type="file" className="form-control mb-3" onChange={handleFileChange2} />

                    <label>Write a short bio of your experience in medical practice. This will be publicly displayed on your profile. You may change this later.</label>
                    <input required className='form-input' type='text' name='profile' value={doctorsData.profile} onChange={e => handleChange(e, setDoctorsData)} />

                    <label>Please enter your medical specialization(s) below.</label>
                    <input required className='form-input' type='text' name='specialization' value={doctorsData.specialization} onChange={e => handleChange(e, setDoctorsData)} />

                    <label>Enter your appointment rate ($USD)</label>
                    <input required className='form-input' type='text' name='rate' value={doctorsData.rate} onChange={e => handleChange(e, setDoctorsData)}></input>

                    <p className='step'>Step 2: Identification & Address</p>

                    <label className="form-label">Upload Identification</label>
                    <input required type="file" className="form-control mb-3" onChange={handleFileChange} />

                    <br></br>
                    <label class="form-label" for="customFile">Enter Medical License Code</label>
                    <input className='form-input' type='text' name='license_number' value={doctorsData.license_number} onChange={e => handleChange(e, setDoctorsData)} />
                    
                    <h5>Address Information</h5>
                    <label>Address</label>
                    <input required className='form-input' type='text' label='Address' name='address' value={addressData.address} onChange={e => handleChange(e, setAddressData)} />
                    <label>Address 2</label>
                    <input className='form-input' type='text' label='Address 2' name='address2' value={addressData.address2} onChange={e => handleChange(e, setAddressData)} />
                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <label>City</label>
                            <input required className='form-input' type='text' label='City' name='city' value={addressData.city} onChange={e => handleChange(e, setAddressData)} />
                        </MDBCol>
                        <MDBCol>
                            <label>State</label>
                            <input required className='form-input' type='text' label='State' name='state' value={addressData.state} onChange={e => handleChange(e, setAddressData)} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <label>Country</label>
                            <input required className='form-input' type='text' label='Country' name='country' value={addressData.country} onChange={e => handleChange(e, setAddressData)} />
                        </MDBCol>
                        <MDBCol>
                            <label>Zip</label>
                            <input required className='form-input' type='text' label='Zip Code' name='zip' value={addressData.zip} onChange={e => handleChange(e, setAddressData)} />
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <label>Location / Meeting Place</label>
                            <input required className='form-input' type='text' label='office' name='office' value={doctorsData.office} onChange={e => handleChange(e, setDoctorsData)} />
                        </MDBCol>
                    </MDBRow>

                    <p className='step'>Step 3: Acknowledgement and Compliance Forms</p>
                    <Eula />

                    <MDBRow className='mb-4'>
                        <MDBCol>
                            <label>Name</label>
                            <input required className='form-input' name='eulaName' value={formMeta.eulaName} onChange={e => handleChange(e, setFormMeta)} />
                        </MDBCol>
                        <MDBCol>
                            <label>Today's Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={formMeta.date}
                                min={getToday()}
                                max={getToday()}
                                onChange={e => handleChange(e, setFormMeta)}
                                required />
                        </MDBCol>
                    </MDBRow>
                    <p id='responsetext' style={{color: 'red', fontWeight:'bold'}}></p>
                    <button type='submit' className='register-btn' >
                        Register
                    </button>
                

            </form>
        </div>
    );
}

export default DoctorForm;