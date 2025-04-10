
import { useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import { useState } from "react";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from "../../../components/Divider";

function PatientDashboard() {
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

    return <>
        <h1>Dashboard</h1>
        <Divider/>
        <div style = {{ display: 'flex', flexDirection: "column" }} >
            <DashboardItem itemName="Write a Review" itemDescription="Write out a review for your doctor." href="/patient/review" icon="doctor_icon" />
            <DashboardItem itemName="Book an Appointment" itemDescription="Schedule an appointment with your doctor." href="/patient/book-appointment" icon="appointment_icon" />   
            <DashboardItem itemName="View Progress" itemDescription="Detailed overview on weight loss thus far." href="/patient/progress" icon="graph_icon" />   
            <DashboardItem itemName="View Prescriptions" itemDescription="View currently assigned prescriptions." href="/patient/prescriptions" icon="pill_icon" />   
        </div>
        
        <br/>
        
        <h1>Appointments</h1>
        <br/>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {patientAppointments.map((appointment, index) => (
                PatientAppointmentCard(appointment)
            ))}
        </div>

    </>
}

export default PatientDashboard;