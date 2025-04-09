import React from 'react';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';

function PatientForm() {
    return (
        <div className='patient-form'>
            <h2>Register as patient</h2>
            <form>

                <p>Step 1: Basic Information</p>
                <MDBRow className='mb-4'>
                    <MDBCol>
                    <MDBInput id='form3Example1' label='First name' />
                    </MDBCol>
                    <MDBCol>
                    <MDBInput id='form3Example2' label='Last name' />
                    </MDBCol>
                </MDBRow>
                <MDBInput className='mb-4' type='email' id='form3Example3' label='Email address' />
                <MDBInput className='mb-4' type='password' id='form3Example4' label='Password' />

                

                

                <p>Step 2: Identification</p>
                

                <p>Step 3: Medical History</p>

                <MDBBtn type='submit' style={{backgroundColor: '#F53D3E', border: 'none'}} className='mb-4' block>
                    Register
                </MDBBtn>
                
                </form>
        </div>
    )
}

export default PatientForm;