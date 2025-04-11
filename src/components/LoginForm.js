import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
  } from 'mdb-react-ui-kit';
import '../css/custom.css';

function LoginForm() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState('first-time');
    const [failedLogin, setFailedLogin] = useState(false);

    const navigate = useNavigate();

    const sessionExists = () => {
      const sessionData = sessionStorage.getItem('user_info');
      return !!sessionData;
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        
        try {

            const response = await fetch(`http://localhost:5000/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),

            });
    
            if (!response.ok) throw new Error('Login failed');
            
            const data = await response.json();
            const user_info = {
              'user_id': data.user_id,
              'email': data.email,
              'role': data.role,
            }

            sessionStorage.setItem('user_info', JSON.stringify(user_info));
            
            setLoggedIn('success');
            setResponseMessage(data.message);

        }
        catch (err) {
          console.error(err);
          setLoggedIn('failed');
        }
        
      };
      
      useEffect(() => {
        if (loggedIn === 'success') { 
          navigate('/dashboard');
        }
        else if (loggedIn === 'failed') {
          setFailedLogin(true);
        }
      }, [loggedIn])

      /*
      if (sessionExists) {
        navigate('/dashboard');
      }*/

    return (

        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <h1 className='login-title'>Sign into your account</h1>

        <form onSubmit={handleSubmit}>

          {failedLogin ? <p style={{color: 'red', fontSize: '18px'}}>Your username or password was incorrect.</p> : <></>}

            <label>Email Address</label>
            <MDBInput wrapperClass='mb-4' label='' id='form1' type='email' value={email} placeholder='Email Address' onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <MDBInput wrapperClass='mb-4' label='' id='form2' type='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>

            <div className="d-flex justify-content-between mx-3 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <a href="!#">Forgot password?</a>
            </div>

            <button type='submit' className="login-btn" href=''>Sign in</button>

            <div className="text-center">
                <p>Not a member? <a href="/sign-up">Register</a></p>
            </div>

        </form>

        </MDBContainer>

    )

}

export default LoginForm;