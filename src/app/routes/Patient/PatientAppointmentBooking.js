import { useEffect } from "react";
import { useState } from "react";
import { getDoctorLastName, getPatientDoctorId, getUserData } from "../../../utils/UserDataUtils";
import DatePicker from "react-datepicker";
import axios from "axios";
import Divider from "../../../components/Divider";
import '../../../css/dashboard.css';
import BetterUNavbar from "../../../components/BetterUNavbar";
import Footer from "../../../components/Footer";
import { user_info, useUser } from "../../UserContext";

function PatientAppointmentBooking() {
    const { userInfo } = useUser();
    const [showMessageAppointment, setShowMessageAppointment] = useState(false);
    const [doctorRate, setDoctorRate] = useState(0.0);
    const [cardEnding, setCardEnding] = useState("Loading...");
    
    const [appointmentData, setAppointmentData] = useState({
        date: "",
        time: "",
        reason: "",
        patient_id: userInfo.user_id,
        doctor_id: 0 
    });

    const [requestMade, setRequestMade] = useState(false);

    const [doctorName, setDoctorName] = useState("");

    const sendAppointmentRequest = async (e) => {
        e.preventDefault();
        try {
            const startTime = `${appointmentData.date} ${appointmentData.time}:00`;
            const endTime = `${appointmentData.date} ${getEndTime(startTime)}`;
                
            const data = {
                "doctor_id": appointmentData.doctor_id,
                "patient_id": userInfo.user_id,
                "reason": appointmentData.reason,
                "start_time": startTime,
                "status": "pending",
            }
                const res = await fetch('/api/betteru/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });
                
                const result = await res.json();
                console.log(result);
        
                if (res.status == 201) {
                    setRequestMade(true);
                }

        } catch (error) {
            console.log(error);
        }
    }
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setAppointmentData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowMessageAppointment(true);
    }

    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        const date = `${year}-${month}-${day}`;
        return String(date);
    }

    const getEndTime = (appointmentStartTime) => {
        const endTime = new Date(appointmentStartTime);
        endTime.setHours(endTime.getHours() + 1);
        return endTime.toTimeString().slice(0, 8);
    }

    useEffect(()=>{
        fetch(`/api/betteru/patients?user_id=${user_info.user_id}`)
        .then(resp => resp.json())
        .then(data => {
            fetch(`/api/betteru/credit_card?creditcard_id=${data.patients[0].creditcard_id}`)
            .then(resp => resp.json())
            .then(data => setCardEnding(data.credit_card[0].card_ending))
        })
        fetch(`/api/betteru/doctors?doctor_id=${appointmentData.doctor_id}`)
        .then(resp => resp.json())
        .then(data => setDoctorRate(data.doctors[0]?.rate))
    }, [showMessageAppointment]);

    useEffect(() => {
        if (!userInfo?.user_id) return; 

        // get request to get doctorId based on patient/doctor relation
        const getDoctor = async () => {
            let doctorId = await getPatientDoctorId(userInfo.user_id);
            setAppointmentData(prev => ({
                ...prev,
                doctor_id: doctorId
            }));
            // Get and set doctor name here
            const doctorName = await getDoctorLastName(doctorId);
            setDoctorName(doctorName);
        }
        getDoctor();
        
    }, [userInfo])

    if (requestMade) {
        return <>


        <h1>Appointment Requested</h1>


        </>
    }

    return <>

    <h1>Book Appointment</h1>
    <Divider/>

    <h2>Dr. {doctorName}</h2>
    <br/>

    <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="appointmentReason" className="form-label">Reason for Appointment</label>
            <input type="text" className="form-control" id="appointmentReason" name="reason" onChange={handleChange} required/>

            <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>

            <input
            type="date"
            id="appointmentDate"
            className="form-control"
            name="date"
            min={getTomorrow()}
            onChange={handleChange}
            required />

            <label htmlFor="appointmentTime" className="form-label">Appointment Time</label>
            <input
                type="time"
                name="time"
                id="appointmentTime"
                className="form-control"
                step="3600"
                min="09:00"
                max="19:00"
                onChange={handleChange}
                required />
        </div>
        
        <button type="submit" className="btn btn-primary">Request Appointment</button>


    </form>

        {showMessageAppointment && (<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Appointment</h5>
                        <button type="button" className="close" onClick={() => setShowMessageAppointment(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                        <p>By confirming this appointment request, you are agreeing that the card on file (ending in {cardEnding}) will be charged the total amount.</p>
                        <p><strong>Total: </strong>${(doctorRate + (Math.round(doctorRate * 13.71)/100)).toFixed(2)}</p>
                        <sup>In the event that you cancel this appointment or Dr. {doctorName} rejects the appointment, you will automatically be refunded the full amount.</sup> <br/>
                        <sup>Additional transaction breakdown can be viewed in the Transactions page on your Patient Dashboard</sup>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={() => setShowMessageAppointment(false)} >Close</button>
                            <button type="button" className="btn btn-success" onClick={sendAppointmentRequest} >Confirm</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>)}

    </>
}

export default PatientAppointmentBooking;