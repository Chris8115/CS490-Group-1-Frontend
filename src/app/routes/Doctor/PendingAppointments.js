import React from 'react';
import '../../../css/pending_appointments.css';

function PendingAppointments() {
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
    ];

    return (
        <div className="pending-appointments-scroll-box ">
            {appointments.map((appt, index) => (
                <div className="pending-appointment-item" key={index}>
                    <div className="appointment-header">
                        <p className="patient-name">{appt.name}</p>
                        <p className="time">{appt.time}</p>
                    </div>
                    <p className="patient-request">"{appt.request}"</p>
                    <div className="appointment-actions">
                        <button className="confirm">Confirm</button>
                        <button className="deny">Deny</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PendingAppointments;
