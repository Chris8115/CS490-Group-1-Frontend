
import { useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import { useState } from "react";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from "../../../components/Divider";
import { useUser } from "../../UserContext";
import { getDoctorLastName } from "../../../utils/UserDataUtils";
import PatientDoctorSearch from "./PatientDoctorSearch";

function PatientDashboard() {
    const [patientAppointments, setPatientAppointments] = useState([]);
    const { userInfo } = useUser();
    const [patientHasDoctor, setPatientHasDoctor] = useState(0);
    const [patientDoctorId, setPatientDoctorId] = useState({});
    const [doctorName, setDoctorName] = useState("");
    

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

        if (!userInfo) return <></>; 

        const checkIfHasDoctor = async () => {
            try {
                const response = await fetch(`/doctor_patient_relationship?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                const data = await response.json();
                const relationships = data.doctor_patient_relationship;
                
                let hasDoctor = false;
                let hasPending = false;

                for (let i = 0; i < relationships.length; i++) {
                    console.log(relationships[i]);
                    if (relationships[i].status === "active") {
                        hasDoctor = true;
                        const doctorName = await getDoctorLastName(relationships[i.doctor_id]);
                        setDoctorName(doctorName);
                    } else if (relationships[i].status === "pending") {
                        hasPending = true;
                        const doctorName = await getDoctorLastName(relationships[i.doctor_id]);
                        setDoctorName(doctorName);
                    }
                }

                if (hasDoctor) {
                    setPatientHasDoctor(1);
                } else if (hasPending) {
                    setPatientHasDoctor(2);
                } else {
                    setPatientHasDoctor(0);
                }

            } catch (e) {
                console.error(e);
            }
        }


        checkIfHasDoctor();
        getPatientAppointments();
    }, [userInfo.user_id])

    if (patientHasDoctor === 0) {
        return <>
        
        <h1>Please Select a Doctor</h1>
        <PatientDoctorSearch />
        
        </>
    } else if (patientHasDoctor === 2) {
        return <>
        
        <h1>Doctor Approval Pending</h1>
        Request with Dr. {doctorName} is pending.
        
        </>
    }

    return <>
        <h1>Dashboard</h1>
        <Divider/>
        <div style = {{ display: 'flex', flexDirection: "column" }} >
            <DashboardItem itemName="Write a Review" itemDescription="Write out a review for your doctor." href="/patient/review" icon="doctor_icon" key="review" />
            <DashboardItem itemName="Book an Appointment" itemDescription="Schedule an appointment with your doctor." href="/patient/book-appointment" icon="appointment_icon" key="appointments" />   
            <DashboardItem itemName="View Progress" itemDescription="Detailed overview on weight loss thus far." href="/patient/progress" icon="graph_icon" key="progress" />   
            <DashboardItem itemName="View Prescriptions" itemDescription="View currently assigned prescriptions." href="/patient/prescriptions" icon="pill_icon" key="prescriptions" />   
        </div>
        
        <br/>
        
        <h1>Appointments</h1>
        <div className="dashboard-features" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {patientAppointments.map((appointment, index) => (
                <PatientAppointmentCard appointment={appointment} key={appointment.appointment_id} />
            ))}
        </div>

    </>
}

export default PatientDashboard;