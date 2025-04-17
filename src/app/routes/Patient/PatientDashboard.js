
import { useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import { useState } from "react";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from "../../../components/Divider";
import { useUser } from "../../UserContext";

function PatientDashboard() {
    const [patientAppointments, setPatientAppointments] = useState([]);
    const { userInfo } = useUser();
    const [patientHasDoctor, setPatientHasDoctor] = useState(true);


    const getPatientAppointments = async() => {
        axios.get("/appointments", {
            params: {
                "patient_id": userInfo.user_id,
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

        if (!userInfo?.user_id) return; 

        const checkIfHasDoctor = async () => {
            try {
                const response = await fetch(`/doctor_patient_relationship?patient_id=${userInfo.user_id}&status=active`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data);
                setPatientHasDoctor(data.doctor_patient_relationship.length > 0);
            } catch (e) {
                console.error(e);
            }
        }


        checkIfHasDoctor();
        getPatientAppointments();
    }, [userInfo])

    if (!patientHasDoctor) {
        return <>
        
        <h1>Please Select a Doctor</h1>
        No doctor
        
        </>
    }

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
        <div className="dashboard-features" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {patientAppointments.map((appointment, index) => (
                PatientAppointmentCard(appointment)
            ))}
        </div>

    </>
}

export default PatientDashboard;