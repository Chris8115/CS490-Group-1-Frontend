
import { useState, useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from '../../../components/Divider.js';
import '../../../css/doctor_dashboard.css';

function DoctorDashboard() {
    const [patientAppointments, setPatientAppointments] = useState([]);

    const getPatientAppointments = async() => {
        axios.get("/appointments", {
            params: {
                "patient_id": 26
            }
        })
        .then((response) => {
            let appointments = response.data.appointments;
            setPatientAppointments(appointments);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {

        })
    }

    useEffect(() => {
        getPatientAppointments();
    }, [])

    return (

        <div className='dashboard'>
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