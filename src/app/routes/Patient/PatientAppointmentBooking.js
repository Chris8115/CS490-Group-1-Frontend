import { useEffect } from "react";
import { useState } from "react";
import { getDoctorLastName, getPatientDoctorId, getUserData } from "../../../utils/UserDataUtils";
import DatePicker from "react-datepicker";
import axios from "axios";
import Divider from "../../../components/Divider";
import '../../../css/dashboard.css';
import BetterUNavbar from "../../../components/BetterUNavbar";
import Footer from "../../../components/Footer";
import { useUser } from "../../UserContext";

function PatientAppointmentBooking() {
    const { userInfo } = useUser();
    
    const [appointmentData, setAppointmentData] = useState({
        date: "",
        time: "",
        reason: "",
        patient_id: userInfo.user_id,
        doctor_id: 0 
    });

    const [requestMade, setRequestMade] = useState(false);

    const [doctorName, setDoctorName] = useState("");

    const handleSubmit = async (e) => {
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

            <label htmlFor="appointmentHour" className="form-label">Appointment Time</label>
            <input
            type="time"
            name="time"
            id="appointmentTime"
            className="form-control"
            step="3600"
            min="00:00:00"
            onChange={handleChange}
            required />
        </div>
        

        <button type="submit" className="btn btn-primary">Request Appointment</button>

    </form>


    </>
}

export default PatientAppointmentBooking;