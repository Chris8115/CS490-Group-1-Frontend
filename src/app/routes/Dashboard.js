import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardRedirect() {
  const navigate = useNavigate();
  const user_info = JSON.parse(sessionStorage.getItem('user_info'));

  useEffect(() => {
    if (!user_info) {
      navigate('/log-in');
    } else {
      // Redirect to the appropriate dashboard based on the user's role
      if (user_info.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user_info.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/log-in');
      }
    }
  }, [user_info, navigate]);

  return null; // Nothing to render, just redirect
}

export default DashboardRedirect;