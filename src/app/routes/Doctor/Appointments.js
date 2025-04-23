import React, { useEffect, useState } from 'react';
import '../../../css/appointments.css';

function formatTimeRange(start, end) {
    const format = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${format(start)} - ${format(end)}`;
}

function Appointments({ appointments, refreshAppointments }) {
    const [patientNames, setPatientNames] = useState({});

    useEffect(() => {
        const fetchPatientNames = async () => {
            const names = {};

            await Promise.all(
                appointments.map(async (appt) => {
                    const patientId = appt.patient_id;
                    if (patientId && !names[patientId]) {
                        try {
                            const response = await fetch(`/api/betteru/users?user_id=${patientId}`);
                            if (!response.ok) throw new Error("Failed to fetch patient");
                            const data = await response.json();
                            names[patientId] = `${data.users[0].first_name} ${data.users[0].last_name}`;
                        } catch (error) {
                            console.error("Error fetching patient info:", error);
                            names[patientId] = "Unknown Patient";
                        }
                    }
                })
            );

            setPatientNames(names);
        };

        if (appointments && appointments.length > 0) {
            fetchPatientNames();
        }

    }, [appointments]);

    const handleCancel = async (appointmentId) => {
        try {
            const res = await fetch(`/api/betteru/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: 'canceled'
                })
            });

            if (!res.ok) throw new Error('Failed to cancel appointment');

            if (refreshAppointments) refreshAppointments(); // Refresh if function is passed

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="appointments-scroll-box">
            {appointments.length === 0 ? 
                <p>No scheduled appointments. Enjoy the day off!</p> :
            
                appointments.map((appt, index) => {
                    const fullName = patientNames[appt.patient_id] ?? undefined;
                    return (
                    
                    
                        <div className="appointment-item" key={appt.appointment_id || index}>
                            <div className="appointment-header">
                                <p className="patient-name">{fullName}</p>
                                <p className="time">{formatTimeRange(appt.start_time, appt.end_time)}</p>
                            </div>
                            <div className="appointment-reason-row">
                                <p className="patient-request">"{appt.reason}"</p>
                                <button
                                    className="cancel-button"
                                    onClick={() => handleCancel(appt.appointment_id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                    );
                })
            }
        </div>
    );
}

export default Appointments;
