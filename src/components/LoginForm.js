import { React, useState, useEffect } from 'react';
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
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();
        console.log(email);
        console.log(password);
        try {
          const response = await fetch(`http://localhost:5000/login?email=${email}&password=${password}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          console.log(data);
          setLoggedIn(true);

          setResponseMessage(data.message);
        } catch (error) {
          setResponseMessage('An error occurred.');
          console.log("An error occurred while logging in.");
        }

      };

      useEffect(() => {
        try {
          const response = fetch(`http://localhost:5000/login_check`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          const data = response.json();
          console.log(data);

          

          setResponseMessage(data.message);
        } catch (error) {
          setResponseMessage('An error occurred.');
          console.log("An error occurred to log in.");
        }
      }, [loggedIn])

    return (

        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <h1 className='login-title'>Sign into your account</h1>

        <form>

            <label>Email Address</label>
            <MDBInput wrapperClass='mb-4' label='' id='form1' type='email'  onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <MDBInput wrapperClass='mb-4' label='' id='form2' type='password' onChange={(e) => setPassword(e.target.value)}/>

            <div className="d-flex justify-content-between mx-3 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <a href="!#">Forgot password?</a>
            </div>

            <button type='submit' className="login-btn" onClick={handleSubmit}>Sign in</button>

            <div className="text-center">
                <p>Not a member? <a href="/sign-up">Register</a></p>
            </div>

        </form>

        </MDBContainer>

    )

}

export default LoginForm;