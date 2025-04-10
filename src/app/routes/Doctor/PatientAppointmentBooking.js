import { useEffect } from "react";
import { useState } from "react";
import { getDoctorLastName, getPatientDoctorId, getUserData } from "../../../utils/UserDataUtils";
import DatePicker from "react-datepicker";
import axios from "axios";

function PatientAppointmentBooking() {
    const [appointmentData, setAppointmentData] = useState({
        date: "",
        time: "",
        reason: "",
        patient_id: 26,
        doctor_id: 0 
    });

    const [doctorName, setDoctorName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startTime = `${appointmentData.date} ${appointmentData.time}:00`;
        const endTime = `${appointmentData.date} ${getEndTime(startTime)}`;
        console.log(startTime);
        console.log(endTime);
        try {
            const response = await axios.put("/appointments", {
                "doctor_id": appointmentData.doctor_id,
                "end_time": endTime,
                "location": "100 Test Rd",
                "patient_id": 26,
                "reason": appointmentData.reason,
                "start_time": startTime,
                "status": "pending",
            })
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
        // get request to get doctorId based on patient/doctor relation
        const getDoctor = async () => {
            let doctorId = await getPatientDoctorId();
            setAppointmentData(prev => ({
                ...prev,
                doctor_id: doctorId
            }));
            // Get and set doctor name here
            const doctorName = await getDoctorLastName(doctorId);
            setDoctorName(doctorName);
        }
        getDoctor();
        
    }, [])

    return <>
    
    <h1>Book Appointment</h1>
    <hr/>
    <h3>Dr. {doctorName}</h3>

    <form onSubmit={handleSubmit}>

        <div className="mb-3">
            <label htmlFor="appointmentReason" className="form-label">Reason for Appointment</label>
            <input type="text" className="form-control" id="appointmentReason" name="reason" onChange={handleChange} required/>

            <br/>

            <label htmlFor="appointmentDate" className="form-label">Appointment Date</label>
            <br/>

            <input
            type="date"
            id="appointmentDate"
            className="form-control"
            name="date"
            min={getTomorrow()}
            onChange={handleChange}
            required />

<           label htmlFor="appointmentHour" className="form-label">Appointment Time</label>
            <br/>
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