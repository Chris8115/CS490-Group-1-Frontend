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
import '../css/registration.css';

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
            const res = await fetch(`/api/betteru/users/patient`, {
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
        acidReflux: false,
        alcoholAddiction: false,
        allergyProblems: false,
        anemia: false,
        anxiety: false,
        arteryVeinProblems: false,
        arthritis: false,
        asthma: false,
        autoimmuneDisease: false,
        bipolarDisorder: false,
        bladderIrritability: false,
        bleedingProblems: false,
        bloodClots: false,
        cancer: false,
        cataracts: false,
        colitisCrohns: false,
        chronicPain: false,
        depression: false,
        diabetes: false,
        drugAddiction: false,
        esophagitisUlcers: false,
        fractures: false,
        gallstones: false,
        glaucoma: false,
        gout: false,
        headaches: false,
        hearingImpairment: false,
        heartAttack: false,
        heartDisease: false,
        heartValveProblems: false,
        hepatitisA: false,
        hepatitisB: false,
        hepatitisC: false,
        hernia: false,
        highBloodPressure: false,
        highCholesterol: false,
        hiv: false,
        irritableBowel: false,
        kidneyDisease: false,
        kidneyStones: false,
        liverDisease: false,
        lungDisease: false,
        mentalIllness: false,
        migraines: false,
        mrsa: false,
        osteoporosis: false,
        recurrentSkinInfections: false,
        recurrentUti: false,
        ptsd: false,
        seizures: false,
        stds: false,
        sleepApnea: false,
        stroke: false,
        tb: false,
        thyroidDiseases: false,
        visionImpairment: false,
        additional: '',
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
        console.log(patientData)
        console.log(updatedConditions)
    };

    const handleAdditionalChange = (event) => {
        const { name, value } = event.target;
        const updatedConditions = {
            ...medicalConditions,
            [name]: value
        }
        setMedicalConditions(updatedConditions);

        const selected = Object.entries(updatedConditions)
            .filter(([_, value]) => value)
            .map(([key]) =>
                key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace('Additional', `Additional Medical History: ${value}`)
            )
            .join(', ');
    
        setPatientData(prev => ({
            ...prev,
            medical_history: selected
        }));
    }

    return (
        <div className='patient-form'>
            <h2>Register as a patient</h2>
            <form onSubmit={handleSubmit}>

                <p className='step'>Step 1: Basic Information</p>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>First name</label>
                        <input className='form-input' required name="first_name" value={userData.first_name} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Last name</label>
                        <input className='form-input' required name="last_name" value={userData.last_name} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Email Address</label>
                        <input className='form-input' required name="email" type='email' value={userData.email} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Phone Number</label>
                        <input className='form-input' required name="phone_number" type='text' value={userData.phone_number} onChange={e => handleChange(e, setUserData)} />
                    </MDBCol>
                </MDBRow>
                <label>Password</label>
                <input className='form-input' required  name="password" type='password' value={userData.password} onChange={e => handleChange(e, setUserData)} />
                <label>Confirm Password</label>
                <input className='form-input' required type='password' />

                <p className='step'>Step 2: Identification, Address & Payment Info</p>

                <label className="form-label">Upload Identification</label>
                <input required type="file" className="form-control mb-3" onChange={handleFileChange} />

                <label>Social Security Number</label>
                <input className='form-input' aria-required type='text' name='ssn' value={patientData.ssn} onChange={e => handleChange(e, setPatientData)} />

                <h5>Address Information</h5>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Address</label>
                        <input className='form-input' required label='Address' name='address' value={addressData.address} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Address 2</label>
                        <input className='form-input' label='Address 2' name='address2' value={addressData.address2} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>City</label>
                        <input className='form-input' required label='City' name='city' value={addressData.city} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>State</label>
                        <input className='form-input' required label='State' name='state' value={addressData.state} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Country</label>
                        <input className='form-input' required label='Country' name='country' value={addressData.country} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Zip Code</label>
                        <input className='form-input' required label='Zip Code' name='zip' value={addressData.zip} onChange={e => handleChange(e, setAddressData)} />
                    </MDBCol>
                </MDBRow>

                <h5>Credit Card Information</h5>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Card Number</label>
                        <input className='form-input' required label='Card Number' name='cardnumber' value={creditCardData.cardnumber} onChange={e => handleChange(e, setCreditCardData)} />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>CVV</label>
                        <input className='form-input' required label='CVV' name='cvv' value={creditCardData.cvv} onChange={e => handleChange(e, setCreditCardData)} />
                    </MDBCol>
                    <MDBCol>
                        <label>Expiration Date (YYYY-MM-DD)</label>
                        <input className='form-input' required label='Expiration Date (YYYY-MM-DD)' name='exp_date' value={creditCardData.exp_date} onChange={e => handleChange(e, setCreditCardData)} />
                    </MDBCol>
                </MDBRow>

                <h5>Medical History</h5>
                <div className='checkbox-grid mb-3'>
                    {Object.entries(medicalConditions).slice(0,-1).map(([key, value]) => (
                        <div key={key} className='checkbox-item'>
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
                    <label>Additional Notes</label>
                    <input className='form-input' label='Additional Medical History' name='additional' value={medicalConditions.additional} onChange={e => handleAdditionalChange(e)} />
                <p className='step'>Step 3: Acknowledgement and Compliance Forms</p>
                <Eula />

                <MDBRow className='mb-4'>
                    <MDBCol>
                        <label>Name</label>
                        <input className='form-input' required name='eulaName' value={formMeta.eulaName} onChange={e => handleChange(e, setFormMeta)} />
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
