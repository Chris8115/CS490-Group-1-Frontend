
import { useState, useEffect, sessionStorage } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from '../../../components/Divider.js';

function DoctorDashboard() {
            

    const [doctorAppointments, setDoctorAppointments] = useState([]);
    
    
    // const user_info = JSON.parse(sessionStorage.getItem('user_info'));
    // console.log(user_info);

    const getDoctorAppointments = async (event) => {
        
        try {

            const response = await fetch(`http://localhost:5000/appointments?doctor_id=31`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }

            });
    
            if (!response.ok) throw new Error('Appointment Request Failed');
            
            const data = await response.json();
            
            console.log(data)
            /*const user_info = {
              'user_id': data.user_id,
              'email': data.email,
              'role': data.role,
            }

            sessionStorage.setItem('user_info', JSON.stringify(user_info));
            
            setLoggedIn('success');
            setResponseMessage(data.message);
            */
        }
        catch (err) {
          console.error(err);
        }
        
      };

    

    useEffect(() => {
        getDoctorAppointments();
    }, [])

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