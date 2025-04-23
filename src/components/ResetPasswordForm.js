import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MDBContainer,
  MDBInput,
  MDBBtn
} from 'mdb-react-ui-kit';
import '../css/custom.css';

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("user_id");

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user_id) {
      setError("Invalid or missing user ID in URL.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/betteru/users/${user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) throw new Error('Password reset failed');

      const data = await response.json();

      alert("Password updated successfully.");
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("Something went wrong while resetting your password. Please try again later.");
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h1 className='login-title'>Reset Your Password</h1>
      <form onSubmit={handleSubmit}>

        <MDBInput
          wrapperClass="mb-4"
          label="New Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <MDBInput
          wrapperClass="mb-4"
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <div className="text-danger mb-3">{error}</div>}

        <MDBBtn type="submit" className="w-100 register-btn">Submit</MDBBtn>
      </form>
    </MDBContainer>
  );
}

export default ResetPasswordForm;
