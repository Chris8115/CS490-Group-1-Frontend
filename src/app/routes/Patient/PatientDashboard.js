
import { useEffect, useRef } from "react";
import DashboardItem from "../../../components/DashboardItem";
import { useState } from "react";
import PatientAppointmentCard from "../../../components/PatientAppointmentCard";
import Divider from "../../../components/Divider";
import { refresh_user_info, user_info, useUser } from "../../UserContext";
import { getDoctorLastName } from "../../../utils/UserDataUtils";
import PatientDoctorSearch from "./PatientDoctorSearch";
import { useNavigate } from "react-router-dom";

// THIS PAGE IS PARTIALLY BROKEN IN STRICT MODE; WORKS FINE IN PRODUCTION BUILDS AND IF YOU REMOVE THE STRICT MODE TAGS FROM index.js

function PatientDashboard() {
    const navigate = useNavigate();
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [patientHasDoctor, setPatientHasDoctor] = useState(true);
    const [loading, setLoading] = useState(true);
    const [doctorName, setDoctorName] = useState("");
    const [doctorInfo, setDoctorInfo] = useState({});
    const [showCancelDoctorModal, setShowCancelDoctorModal] = useState(false);
    const [showMessageDoctorModal, setShowMessageDoctorModal] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");

    const getPatientAppointments = async() => {
        try {
            const response = await fetch(`/api/betteru/appointments?patient_id=${user_info.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            const data = await response.json();
            let filteredAppointments = [];
            
            for (let i = 0; i < data.appointments.length; i++) {
                if (data.appointments[i].status !== "canceled") {
                    filteredAppointments.push(data.appointments[i]);
                }
            }

            setPatientAppointments(filteredAppointments);

        } catch (e) {
            console.error(e);
        }


    }
    
    const checkIfHasDoctor = async () => {
        try {
            const response = await fetch(`/api/betteru/doctor_patient_relationship?patient_id=${user_info.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            const relationships = data.doctor_patient_relationship;
            let doctorId = -1;
            
            let hasDoctor = false;

            for (let i = 0; i < relationships.length; i++) {
                console.log(relationships[i]);
                if (relationships[i].status === "active") {
                    hasDoctor = true;
                    doctorId = relationships[i].doctor_id;
                    const doctorName = await getDoctorLastName(doctorId);
                    setDoctorName(doctorName);
                    break;
                }
            }
            if (hasDoctor) {
                setPatientHasDoctor(true);
            } else {
                setPatientHasDoctor(false);
                return;
            }

            const doctorResponse = await fetch(`/api/betteru/doctors?doctor_id=${doctorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const doctorData = await doctorResponse.json();
            setDoctorInfo(doctorData.doctors[0]);

        } catch (e) {
            console.error(e);
        }
    }

    const changeDoctor = async () => {
        const payload = {
            notes: "",
            status: "inactive"
        }
        const removeDoctor = await fetch(`/api/betteru/doctor_patient_relationship/${doctorInfo.doctor_id}/${user_info.user_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await removeDoctor.json();
        navigate(0);
    }

    useEffect(() => {
        refresh_user_info();
        if (!user_info) {
            navigate('/log-in');
            return;
        }

        if (user_info.user_id) {
            checkIfHasDoctor();
            getPatientAppointments();
            setLoading(false);
        };
    }, [user_info]);

    if (loading) {return <></>}

    if (!patientHasDoctor) {
        return <>
        
        <h1>Please Select a Doctor</h1>
        <PatientDoctorSearch />
        
        </>
    }

    function sendMessage() {
        fetch(`/api/betteru/users?user_id=${user_info.user_id}`)
        .then(resp => {console.log(resp); return resp.json()})
        .then(data => {
            console.log(data);
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'email_subject': `A message from your patient.`,
                  'email_body': `Your patient, ${data.users[0].first_name} ${data.users[0].last_name} has sent you a message: \r\n\r\n${emailMessage}\r\n\r\nTo reply, log into your Dashboard and send them a message.`
                })
              };
            fetch(`/api/betteru/mail/${doctorInfo.doctor_id}`, requestOptions)
            .then(resp => resp.json())
            .then(data => {
                alert(data.message);
            })
        })

    }

    return <>
        <h1>Dashboard</h1>
        <Divider/>
        <div style = {{ display: 'flex', flexDirection: "column" }} >
            <DashboardItem itemName="Write a Review" itemDescription="Write out a review for your doctor." href="/patient/review" icon="doctor_icon" key="review" />
            <DashboardItem itemName="Book an Appointment" itemDescription="Schedule an appointment with your doctor." href="/patient/book-appointment" icon="appointment_icon" key="appointments" />   
            <DashboardItem itemName="View Progress" itemDescription="Detailed overview on weight loss thus far." href="/patient/progress" icon="graph_icon" key="progress" />   
            <DashboardItem itemName="View Prescriptions" itemDescription="View currently assigned prescriptions." href="/patient/prescriptions" icon="pill_icon" key="prescriptions" />
            <DashboardItem itemName="View Transactions" itemDescription="View your past transactions." href="/patient/transactions" icon="trans_icon" key="transactions" />   
        </div>
        
        <br/>
        
        <h1>Appointments</h1>
        <div className="dashboard-features" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {patientAppointments.length > 0 ? (patientAppointments.map((appointment, index) => (
                <PatientAppointmentCard appointment={appointment} key={appointment.appointment_id} />
            ))
            ) : (
                <p>No Appointments</p>
            )}
        </div>
        
        <h1>Dr. {doctorInfo.last_name}</h1>
        <div style={{ display: 'flex', flexDirection: "row" }}>
            
            <img src={doctorInfo.picture} />
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <h2>{doctorInfo.specialization}</h2>
                <p>{doctorInfo.profile}</p>
            </div>
        </div>
        <br/>
        
        <div style={{display: 'flex', flexDirection: 'row', gap: '0.5rem'}}>
            <button type="button" className="btn btn-danger" onClick={() => setShowCancelDoctorModal(true)}>Switch Doctor</button>
            {showCancelDoctorModal && (<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm</h5>
                            <button type="button" className="close" onClick={() => setShowCancelDoctorModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                            <p>Are you sure you want to switch your doctor?</p>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={() => setShowCancelDoctorModal(false)} >Close</button>
                                <button type="button" className="btn btn-danger" onClick={changeDoctor} >Change Doctor</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
            <button type="button" className="btn btn-success" onClick={() => setShowMessageDoctorModal(true)}>Message Doctor</button>
            {showMessageDoctorModal && (<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Message Doctor</h5>
                            <button type="button" className="close" onClick={() => setShowMessageDoctorModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                            <p>Enter the message to your doctor below</p>
                            <input type="text" onChange={(e)=>{setEmailMessage(e.target.value)}}></input>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={() => setShowMessageDoctorModal(false)} >Close</button>
                                <button type="button" className="btn btn-success" onClick={sendMessage} >Send Message</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    </>
}

export default PatientDashboard;