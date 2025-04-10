import { React, useState } from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';
import FileDropbox from './FileDropbox.js';
import Eula from './Eula.js';

function DoctorForm() {

    const [appointmentData, setAppointmentData] = useState({
            date: "",
            time: "",
            reason: "",
            patient_id: 26,
            doctor_id: 0 
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

    const handleChange = (e) => {
        const {name, value} = e.target;
        setAppointmentData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    

    return (
        <div className='patient-form'>
            <h2>Register as a doctor</h2>
            <form>

                <p className='step'>Step 1: Basic Information</p>
                <MDBRow className='mb-4'>
                    <MDBCol>
                    <label>First name</label>
                    <MDBInput id='form3Example1' label='' />
                    </MDBCol>
                    <MDBCol>
                    <label>Last name</label>   
                    <MDBInput id='form3Example2' label='' />
                    </MDBCol>
                </MDBRow>
                <MDBRow className='mb-4'>
                    <MDBCol>
                    <label>Email Address</label>
                    <MDBInput id='form3Example1' label='' />
                    </MDBCol>
                    <MDBCol>
                    <label>Phone Number</label>
                    <MDBInput id='form3Example2' label='' />
                    </MDBCol>
                </MDBRow>
                <label>Password</label>
                <MDBInput className='mb-4' type='password' id='form3Example4' label='' />
                <label>Confirm Password</label>
                <MDBInput className='mb-4' type='password' id='form3Example4' label='' />

                <label>Write a short bio of your experience in medical practice. This will be publicly displayed on your profile. You may change this later.</label>
                <MDBInput className='mb-4' type='' id='form3Example4' label='' />

                <label>Please enter your medical specialization(s) below.</label>
                <MDBInput className='mb-4' type='' id='form3Example4' label='' />

                <p className='step'>Step 2: Identification</p>
                
                <label class="form-label" for="customFile">Upload Identification (Driver's License, Passport, or other government-issued photo ID)</label>
                <input type="file" class="form-control" id="customFile" />

                <br></br>
                <label class="form-label" for="customFile">Enter Medical License Code</label>
                <MDBInput className='mb-4' type='number' id='form3Example4' label='' />

                

                <p className='step'>Step 3: Acknowledgement and Compliance Forms</p>

                <p className='step-descrip'>BetterU™ requires all doctors to sign the following agreement regarding use of services, compliance, and safety. Please read the following document and give your digital signature upon completion.</p>
                
                <Eula />

                <MDBRow className='mb-4'>
                    <MDBCol>
                    <label>Name</label>
                    <MDBInput id='form3Example1' label='' />
                    </MDBCol>
                    <MDBCol>
                    <label>Today's Date</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        className="form-control"
                        name="date"
                        min={getTomorrow()}
                        onChange={handleChange}
                        required />

                          
                    </MDBCol>
                </MDBRow>

                <MDBBtn type='submit' style={{backgroundColor: '#F53D3E', border: 'none'}} className='mb-4' block>
                    Register
                </MDBBtn>
                

                </form>
        </div>
    )
}

export default DoctorForm;