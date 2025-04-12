
import { useState, useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import Divider from '../../../components/Divider.js';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {

    const navigate = useNavigate();
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setUserInfo(user_info);

        getDoctorAppointments();
        
    }, [])


    const getDoctorAppointments = async (event) => {
        
        try {

            const response = await fetch(`http://localhost:5000/appointments?doctor_id=${userInfo.user_id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'

            });
    
            if (!response.ok) throw new Error('Appointment Request Failed');
            
            const data = await response.json();
            
            console.log(data)
            
        }
        catch (err) {
          console.error(err);
        }
        
      };

    return (

        <div>
            <h1>Dashboard</h1>
            <Divider />
            
            <div>
                <h2>Today's Appointments</h2>
                <div className='Appointments'>
                    <p>No appointments for today.</p>
                </div>
            </div>
            
            <div>
                <h2>Pending Appointments</h2>
                <div className='Appointments'>
                    <p>No pending appointments.</p>
                </div>
            </div>

            <div className='doctor-features'>
                <DashboardItem itemName="View Patients" itemDescription="View current patients" href="/patient/review" icon="user_icon" />
                <DashboardItem itemName="Set Appointment Details" itemDescription="Set details of appointment time, location, and method to send to each patient" href="/patient/review" icon="clock" />

            
            </div>
            
        
            
            <br />

        </div>

    )
}

export default DoctorDashboard;