
import { useEffect, useRef } from "react";
import DashboardItem from "../../../components/DashboardItem";
import { useState } from "react";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from "../../../components/Divider";
import { useUser } from "../../UserContext";
import { getDoctorLastName } from "../../../utils/UserDataUtils";
import PatientDoctorSearch from "./PatientDoctorSearch";

// THIS PAGE IS PARTIALLY BROKEN IN STRICT MODE; WORKS FINE IN PRODUCTION BUILDS AND IF YOU REMOVE THE STRICT MODE TAGS FROM index.js

function PatientDashboard() {
    const { userInfo } = useUser();
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [patientHasDoctor, setPatientHasDoctor] = useState(true);
    const [loading, setLoading] = useState(true);
    const [doctorName, setDoctorName] = useState("");

    const getPatientAppointments = async() => {
        try {
            const response = await fetch(`/api/betteru/appointments?patient_id=${userInfo.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            const data = await response.json();
            console.log("Appointments: ", data);
            setPatientAppointments(data.appointments);


        } catch (e) {
            console.error(e);
        }


    }
    
    const checkIfHasDoctor = async () => {
        try {
            const response = await fetch(`/api/betteru/doctor_patient_relationship?patient_id=${userInfo.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            const relationships = data.doctor_patient_relationship;
            
            let hasDoctor = false;

            for (let i = 0; i < relationships.length; i++) {
                console.log(relationships[i]);
                if (relationships[i].status === "active") {
                    hasDoctor = true;
                    const doctorName = await getDoctorLastName(relationships[i].doctor_id);
                    setDoctorName(doctorName);
                    break;
                }
            }
            if (hasDoctor) {
                setPatientHasDoctor(true);
            } else {
                setPatientHasDoctor(false);
            }

        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            if (userInfo?.user_id) {
                await checkIfHasDoctor();
                await getPatientAppointments();
                setLoading(false);
            };
        }
        loadData();
    
    }, [userInfo]);

    if (loading) {return <></>}

    if (!patientHasDoctor) {
        return <>
        
        <h1>Please Select a Doctor</h1>
        <PatientDoctorSearch />
        
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