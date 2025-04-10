import React from 'react';
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  } from 'mdb-react-ui-kit';
import '../css/custom.css';

function LoginForm() {
    return (

        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <h1 className='login-title'>Sign into your account</h1>

        <label>Email Address</label>
        <MDBInput wrapperClass='mb-4' label='' id='form1' type='email'/>
        <label>Password</label>
        <MDBInput wrapperClass='mb-4' label='' id='form2' type='password'/>

        <div className="d-flex justify-content-between mx-3 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
        </div>

        <MDBBtn className="mb-4 login-btn">Sign in</MDBBtn>

        <div className="text-center">
            <p>Not a member? <a href="/sign-up">Register</a></p>
        </div>

        </MDBContainer>

    )

}

export default LoginForm;