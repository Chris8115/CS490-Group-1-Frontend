
import { useState, useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import Divider from '../../../components/Divider.js';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Route, Routes } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import '../../../css/doctor_dashboard.css';
import DoctorSettings from "./DoctorSettings.js";
import DoctorPatientView from "./DoctorPatientView.js";

function DoctorDashboard() {

    const navigate = useNavigate();
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [userInfo, setUserInfo] = useState({});

    const [date, setDate] = useState(new Date());

    const handleChange = (newDate) => {
        setDate(newDate);
        console.log('Selected date:', newDate);
      };


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
                <h2>View Appointments</h2>
                <div className='appointments'>
                    <Calendar onChange={handleChange} value={date} />
                    <p>No appointments for today.</p>
                </div>
            </div>
            
            <div>
                <h2>Pending Appointments</h2>
                <div className=''>
                    <p>No pending appointments.</p>
                </div>
            </div>

            <div className='doctor-features'>
                <DashboardItem itemName="View Patients" itemDescription="View current patients" href="/doctor/view_patients" icon="user_icon" />
                <DashboardItem itemName="Account and Appointment Settings" itemDescription="Set public account details and appointment settings" href="/doctor/settings" icon="gear" />

            
            </div>
            
        
            
            <br />

        </div>

    )
}

export default DoctorDashboard;