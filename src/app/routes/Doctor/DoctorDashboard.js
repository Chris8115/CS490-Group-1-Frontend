
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
import Appointments from "./Appointments.js";
import PendingAppointments from "./PendingAppointments.js";
import '../../../css/appointments.css';

function DoctorDashboard() {

    const navigate = useNavigate();
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [date, setDate] = useState(new Date());

    const [pendingAppointments, setPendingAppointments] = useState([]);
    let displayAppointments;

    const handleChange = async (newDate) => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));

        setDate(newDate);
        // console.log('Selected date:', newDate);
      
        const formattedDate = newDate.toISOString().split('T')[0]; // get actual date
      
        try {
          const response = await fetch(`/appointments?doctor_id=${user_info.user_id}&start_time=${formattedDate}&status=accepted`);
          if (!response.ok) throw new Error('Failed to fetch appointments');
      
          const appointments = await response.json();
          setDoctorAppointments(appointments);
          // console.log(doctorAppointments);

        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      };

    useEffect(() => {

        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setUserInfo(user_info);

        handleChange(date); // Get initial doctor appointments, render them

        displayAppointments = <Appointments appointments={doctorAppointments} className="appointment-cards" />

    }, []);


    const getDoctorAppointments = async () => {
        
        // sconst formattedDate = date.toISOString().split('T')[0];
        // console.log(formattedDate);

        try {

            const response = await fetch(`http://localhost:5000/appointments?doctor_id=${userInfo.user_id}&start_time=${1}&status=accepted`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'

            });
    
            if (!response.ok) throw new Error('Appointment Request Failed');
            
            const data = await response.json();
            setDoctorAppointments(data);
            // console.log(data);
                        
        }
        catch (err) {
          console.error(err);
        }
        
      };

    return (

        <div >

            <h1>Dashboard</h1>
            <Divider />
            
            <h2>View Appointments</h2>
            <div className="appointments-container">
                <div className="calendar-panel">
                        <Calendar onChange={handleChange} value={date} />
                </div>
                <div className="appointments-panel">
                        {doctorAppointments.appointments === 0 ? 
                            <p>No appointments for today.</p> :
                            <Appointments appointments={doctorAppointments.appointments} className="appointment-cards" />
                        }
                </div>
            </div>
            
            <div>
                <h2>Pending Appointments</h2>
                <PendingAppointments />

            </div>
            <Divider />
            <div className='doctor-features'>
                <DashboardItem itemName="View Patients" itemDescription="View current patients" href="/doctor/view-patients" icon="user_icon" />
                <DashboardItem itemName="Account and Appointment Settings" itemDescription="Set public account details and appointment settings" href="/doctor/settings" icon="gear" />

            
            </div>
            
        
            
            <br />

        </div>

    )
}

export default DoctorDashboard;