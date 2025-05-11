import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refresh_user_info, user_info } from '../UserContext'

function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    refresh_user_info();
    if (!user_info) {
      navigate('/log-in');
    } else {
      // Redirect to the appropriate dashboard based on the user's role
      if (user_info.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user_info.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user_info.role === 'pharmacist') {
        navigate('/pharmacy/dashboard');
      } else {
        navigate('/pharmacy');
      }
    }
  }, [user_info, navigate]);

  return null; // Nothing to render, just redirect
}

export default DashboardRedirect;