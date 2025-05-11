import React, { useEffect, useState } from 'react';
import '../../../css/appointments.css';

function formatTimeRange(start, end) {
    const format = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${format(start)} - ${format(end)}`;
}

function Appointments({ appointments, refreshAppointments }) {
    const [patientNames, setPatientNames] = useState({});
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [editedNotes, setEditedNotes] = useState('');
    const [activeAppointment, setActiveAppointment] = useState(null);

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
                            <p className="patient-name">
                            <a href={`/doctor/doctor_patient_info/${appt.patient_id}`} style={{ textDecoration: 'underline', color: '#007bff' }}>
                                {fullName}
                            </a>
                            </p>
                            <strong className="time">{formatTimeRange(appt.start_time, appt.end_time)}</strong>
                            </div>
                            <div className="appointment-reason-row">
                                <p className="patient-request">"{appt.reason}"</p>
                                <button
                                    className="edit-notes-button"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => {
                                        setEditedNotes(appt.notes || '');
                                        setActiveAppointment(appt);
                                        setShowNotesModal(true);
                                    }}
                                    >
                                    Edit Appointment Notes
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleCancel(appt.appointment_id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                    );
                })
            }

            {showNotesModal && (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Edit Appointment Notes</h5>
                    <button type="button" className="close" onClick={() => setShowNotesModal(false)}>&times;</button>
                    </div>
                    <div className="modal-body">
                    <textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        style={{ width: '100%', height: '150px', padding: '10px' }}
                    />
                    </div>
                    <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowNotesModal(false)}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                        try {
                            const res = await fetch(`/api/betteru/appointments/${activeAppointment.appointment_id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                notes: editedNotes
                            })
                            });
                            if (!res.ok) throw new Error('Failed to update appointment notes');

                            if (refreshAppointments) refreshAppointments();
                            setShowNotesModal(false);
                        } catch (err) {
                            console.error(err);
                            alert("Could not save notes.");
                        }
                        }}
                    >
                        Save
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
    );
}



export default Appointments;
