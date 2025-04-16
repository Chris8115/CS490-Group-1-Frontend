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

function LoginForm() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [responseMessage, setResponseMessage] = useState('');
    const [failedLogin, setFailedLogin] = useState(false);

    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('user_info');

    useEffect(() => {
      if (isLoggedIn) {
        navigate('/dashboard');
      }
    }, []);

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
            else {

              const data = await response.json();
              const user_info = {
                'user_id': data.user_id,
                'email': data.email,
                'role': data.role,
              }

              sessionStorage.setItem('user_info', JSON.stringify(user_info));
              
              navigate('/dashboard');
            }

        }
        catch (err) {
          console.error(err);
          setFailedLogin(true);
        }
        
      };
    async function ClickForgotPassword(){
      let email = prompt("Enter your email address.", "Email");
      let Emaildata = null;
      if(email){
        await fetch(`/users?email=${encodeURI(email)}`)
        .then(data => {
          /**/
          console.log(data);
          return data;
          //console.log(requestOptions);
        })
        .then(resp => resp.json())
        .then(Emaildata => {
          if(Emaildata.users.length == 0){
            throw new Error('Invalid email')
          }
          return Emaildata.users[0]
        })
        .then(userData => {
          const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'email_body': 'Your password reset link: NULL\n If you did not request this, you can ignore. Someone may have typed your email by mistake.',
              'email_subject': 'BetterU Password Reset request.'
            })
          };
          fetch(`/mail/${userData['user_id']}`, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            alert(data.message);
          })
        })
        .catch(error => {
          alert("Invalid Email.");
        })
      }
    }
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
                <a style={{'cursor': 'pointer'}} onClick={ClickForgotPassword}>Forgot password?</a>
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