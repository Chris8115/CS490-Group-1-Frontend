import React from 'react';
import '../../../css/appointments.css';

function Appointments() {
    const appointments = [
        {
            name: 'Eric Zhang',
            time: '2:00 - 3:00 pm',
            request: "I'd like to meet with you regarding my injured tummy.",
        },
        {
            name: 'Alice Johnson',
            time: '3:30 - 4:00 pm',
            request: "Need a follow-up for my ankle injury.",
        },
        {
            name: 'John Smith',
            time: '4:15 - 5:00 pm',
            request: "Checkup after surgery last month.",
        },
        // Add more dummy data as needed
    ];

    return (
        <div className="appointments-scroll-box">
            {appointments.map((appt, index) => (
                <div className="appointment-item" key={index}>
                    <div className="appointment-header">
                        <p className="patient-name">{appt.name}</p>
                        <p className="time">{appt.time}</p>
                    </div>
                    <p className="patient-request">"{appt.request}"</p>
                </div>
            ))}
        </div>
    );
}

export default Appointments;
