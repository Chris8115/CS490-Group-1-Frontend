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

function ResetPassword() {
  const handleSubmit = async (event) => {

    event.preventDefault();
    
    try {

        const response = await fetch(`http://localhost:5000/login`, {
          method: 'PATCH',
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
  return (
    <form onSubmit={handleSubmit}>
      <MDBInput wrapperClass='mb-4' label='' id='form2' type='password' value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
    </form>
  );
}

export default ResetPassword;