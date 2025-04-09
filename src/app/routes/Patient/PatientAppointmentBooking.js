import { useEffect } from "react";
import { useState } from "react";

function PatientAppointmentBooking() {
    const [appointmentData, setAppointmentData] = useState({
        dateTime: "",
        reason: "",
        patient_id: 0,
        doctor_id: 0 
    });

    const [doctorName, setDoctorName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(appointmentData);
    }
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setAppointmentData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        console.log("Akljhsdjkh");
        // get request to get doctorId based on patient/doctor relation

        // Get and set doctor name here

        
    })

    return <>
    
    <h1>Book Appointment</h1>
    <hr/>
    
    <form onSubmit={handleSubmit}>


        <div className="mb-3">
            <label htmlFor="appointmentReason" className="form-label">Reason for Appointment</label>
            <input type="text" className="form-control" id="appointmentReason" name="reason" onChange={handleChange}/>
        </div>

        {/** Add some react component for picking time here */}

        <button>Submit</button>

    </form>
    </>
}

export default PatientAppointmentBooking;