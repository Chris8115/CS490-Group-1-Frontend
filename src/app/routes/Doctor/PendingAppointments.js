import React, { useEffect, useState } from 'react';
import '../../../css/pending_appointments.css';

function formatTimeRange(start, end) {
    const format = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${format(start)} - ${format(end)}`;
}

function PendingAppointments({ appointments, setAppointments }) {
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

        if (Array.isArray(appointments) && appointments.length > 0) {
            fetchPatientNames();
        }
    }, [appointments]);

    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const response = await fetch(`/api/betteru/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update appointment');

            setAppointments(prev => {
                if (!Array.isArray(prev)) {
                    console.warn("setAppointments expected an array but received:", prev);
                    return [];
                }
                return prev.filter(appt => Number(appt.appointment_id) !== Number(appointmentId));
            });
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };

    return (
        <div className="appointments-scroll-box">
            {Array.isArray(appointments) && appointments.length === 0 ? (
                <p>No pending appointments.</p>
            ) : (
                appointments.map((appt, index) => {
                    const fullName = patientNames[appt.patient_id] ?? undefined;
                    return (
                        <div className="appointment-item" key={appt.appointment_id || index}>
                            <div className="appointment-header">
                                <p className="patient-name">{fullName}</p>
                                <p className="time">{formatTimeRange(appt.start_time, appt.end_time)}</p>
                            </div>
                            <p className="patient-request">"{appt.reason}"</p>
                            <div className="appointment-actions">
                                <button onClick={() => updateAppointmentStatus(appt.appointment_id, 'accepted')} className="confirm">
                                    Accept
                                </button>
                                <button onClick={() => updateAppointmentStatus(appt.appointment_id, 'rejected')} className="deny">
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default PendingAppointments;
