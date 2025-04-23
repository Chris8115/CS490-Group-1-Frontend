import React, { useState } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';
import Eula from './Eula';
import Checkbox from '@mui/material/Checkbox';
import { BACKEND_HOST, PHARMA_HOST } from './Hosts.js'
import { useNavigate } from 'react-router-dom';

function PatientForm() {
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

    const [creditCardData, setCreditCardData] = useState({
        cardnumber: '',
        cvv: '',
        exp_date: ''
    });

    const [patientData, setPatientData] = useState({
        ssn: '',
        medical_history: ''
    });

    const [formMeta, setFormMeta] = useState({
        date: '',
        eulaName: '',
        identificationFile: null
    });

    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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

    const handleFileChange = (e) => {
        setFormMeta(prev => ({
            ...prev,
            identificationFile: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', JSON.stringify({
            ...userData,
            role: 'patient'
        }));
        formData.append('address', JSON.stringify(addressData));
        formData.append('credit_card', JSON.stringify(creditCardData));
        formData.append('patient', JSON.stringify(patientData));
        formData.append('doctor', ''); // empty for patients
        formData.append('pharmacist', ''); // empty for patients

        if (formMeta.identificationFile) {
            formData.append('identification', formMeta.identificationFile);
        }

        try {
            const res = await fetch(`http://${BACKEND_HOST}/users/patient`, {
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
            //alert(result.message || 'Patient registered!');
        } catch (err) {
            console.error(err);
            alert('Registration failed.');
        }
    };

    const [medicalConditions, setMedicalConditions] = useState({
        smoker: false,
        heartDisease: false,
        diabetes: false,
        highBloodPressure: false,
        asthma: false,
    });

    const handleConditionChange = (event) => {
        const { name, checked } = event.target;
        const updatedConditions = {
            ...medicalConditions,
            [name]: checked
        };
        setMedicalConditions(updatedConditions);
    
        const selected = Object.entries(updatedConditions)
            .filter(([_, value]) => value)
            .map(([key]) =>
                key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
            )
            .join(', ');
    
        setPatientData(prev => ({
            ...prev,
            medical_history: selected
        }));
    };

    return (
        <div className='patient-form'>
            <h2>Register as a patient</h2>
            <form onSubmit={handleSubmit}>

                <p className='step'>Step 1: Basic Information</p>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>First name</label>
                        <MDBInput required name="first_name" value={userData.first_name} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Last name</label>
                        <MDBInput required name="last_name" value={userData.last_name} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Email Address</label>
                        <MDBInput required name="email" type='email' value={userData.email} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Phone Number</label>
                        <MDBInput required name="phone_number" type='text' value={userData.phone_number} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                </MDBRow>
                <label>Password</label>
                <MDBInput required className='mb-4' name="password" type='password' value={userData.password} onChange={e => handleChange(e, setUserData)} />
                <label>Confirm Password</label>
                <MDBInput required className='mb-4' type='password' />

                <p className='step'>Step 2: Identification, Address & Payment Info</p>

                <label className="form-label">Upload Identification</label>
                <input required type="file" className="form-control mb-3" onChange={handleFileChange} />

                <label>Social Security Number</label>
                <MDBInput required className='mb-4' type='text' name='ssn' value={patientData.ssn} onChange={e => handleChange(e, setPatientData)} />

                <h5>Address Information</h5>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <MDBInput required label='Address' name='address' value={addressData.address} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                    <MDBCol>
                        <MDBInput label='Address 2' name='address2' value={addressData.address2} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <MDBInput required label='City' name='city' value={addressData.city} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                    <MDBCol>
                        <MDBInput required label='State' name='state' value={addressData.state} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <MDBInput required label='Country' name='country' value={addressData.country} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                    <MDBCol>
                        <MDBInput required label='Zip Code' name='zip' value={addressData.zip} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                </MDBRow>

                <h5>Credit Card Information</h5>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <MDBInput required label='Card Number' name='cardnumber' value={creditCardData.cardnumber} onChange={e => handleChange(e, setCreditCardData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <MDBInput required label='CVV' name='cvv' value={creditCardData.cvv} onChange={e => handleChange(e, setCreditCardData)} />
                    </MDBCol>
                    <MDBCol>
                        <MDBInput required label='Expiration Date (YYYY-MM-DD)' name='exp_date' value={creditCardData.exp_date} onChange={e => handleChange(e, setCreditCardData)} />
                    </MDBCol>
                </MDBRow>

                <p className='step-descrip'>Upload Existing Medical History</p>
                <div className='mb-3'>
                    {Object.entries(medicalConditions).map(([key, value]) => (
                        <div key={key}>
                            <label>
                                <Checkbox
                                    name={key}
                                    checked={value}
                                    onChange={handleConditionChange}
                                />
                                {key
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase())}
                            </label>
                        </div>
                    ))}
                </div>
                <p className='step'>Step 3: Acknowledgement and Compliance Forms</p>
                <Eula />

                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Name</label>
                        <MDBInput required name='eulaName' value={formMeta.eulaName} onChange={e => handleChange(e, setFormMeta)} />
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
                <MDBBtn type='submit' style={{ backgroundColor: '#F53D3E', border: 'none' }} className='mb-4' block>
                    Register
                </MDBBtn>

            </form>
        </div>
    );
}

export default PatientForm;
