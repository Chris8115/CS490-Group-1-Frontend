import { React, useState, useEffect } from 'react';
import { useFetcher, useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  } from 'mdb-react-ui-kit';
import '../css/custom.css';

function PharmacyLoginForm() {
    
    const [pharmacist_id, setpharmacist_id] = useState('');
    const [password, setPassword] = useState('');
    // const [responseMessage, setResponseMessage] = useState('');
    const [failedLogin, setFailedLogin] = useState(false);

    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('user_info');

    useEffect(() => {
      if (isLoggedIn) {
        navigate('/pharmacy/dashboard');
      }
    }, []);

    const handleSubmit = async (event) => {

        event.preventDefault();
        
        try {

            const response = await fetch(`/api/pharmacy/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ pharmacist_id, password }),

            });
    
            if (!response.ok) throw new Error('Login failed');
            else {

              const data = await response.json();
              console.log(data);
              const user_info = {
                'user_id': data.pharmacist_id,
                'role': 'pharmacist',
                'pharmacy_location': data.pharmacy_location
              }

              sessionStorage.setItem('user_info', JSON.stringify(user_info));
              
              navigate('/pharmacy/dashboard');
            }

        }
        catch (err) {
          console.error(err);
          setFailedLogin(true);
        }
        
      };
      
    return (

        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <h1 className='login-title'>Sign into your account</h1>

        <form onSubmit={handleSubmit}>

          {failedLogin ? <p style={{color: 'red', fontSize: '18px'}}>Your username or password was incorrect.</p> : <></>}

            <label>Pharmacist ID</label>
            <MDBInput wrapperClass='mb-4' label='' id='form1' type='number' value={pharmacist_id} placeholder='Pharmacy ID' onChange={(e) => setpharmacist_id(e.target.value)} />
            <label>Password</label>
            <MDBInput wrapperClass='mb-4' label='' id='form2' type='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>

            {/* Comments out the forgot password parts for now
                <div className="d-flex justify-content-between mx-3 mb-4">
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                    <a style={{'cursor': 'pointer'}} onClick={ClickForgotPassword}>Forgot password?</a>
                </div>
            */}

            <button type='submit' className="login-btn" href=''>Sign in</button>

            {/*<div className="text-center">
                <p>Not a member? <a href="/sign-up">Register</a></p>
            </div>*/}

        </form>

        </MDBContainer>

    )

}

export default PharmacyLoginForm;