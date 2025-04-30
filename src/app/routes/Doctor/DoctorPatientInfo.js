import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/patient_info.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function DoctorPatientInfo() {
    const { patient_id } = useParams();
    const navigate = useNavigate();

    const [patientName, setPatientName] = useState('');
    const [patient, setPatient] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [assignedExercises, setAssignedExercises] = useState([]);
    const [allExercisePlans, setAllExercisePlans] = useState([]);
    const [searchExercise, setSearchExercise] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newExerciseTitle, setNewExerciseTitle] = useState('');
    const [newExerciseContent, setNewExerciseContent] = useState('');
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState('');
    const [editingNotes, setEditingNotes] = useState(false);
    const [newNotes, setNewNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAll() {
            const user_info = JSON.parse(sessionStorage.getItem('user_info'));
            try {
                const [pRes, eRes, aRes, uRes, nRes, assignedRes, allPostsRes] = await Promise.all([
                    fetch(`/api/betteru/patients?patient_id=${patient_id}`),
                    fetch(`/api/betteru/patient_exercise_assignments?patient_id=${patient_id}`),
                    fetch(`/api/betteru/appointments?patient_id=${patient_id}`),
                    fetch(`/api/betteru/users?user_id=${patient_id}`),
                    fetch(`/api/betteru/doctor_patient_relationship?patient_id=${patient_id}&doctor_id=${user_info.user_id}`),
                    fetch(`/api/betteru/patient_exercise_assignments?doctor_id=${user_info.user_id}&patient_id=${patient_id}`),
                    fetch(`/api/betteru/forum_posts`)
                ]);

                if (!pRes.ok || !eRes.ok || !aRes.ok || !uRes.ok || !nRes.ok || !assignedRes.ok || !allPostsRes.ok) {
                    throw new Error("There was an error in loading patient data.");
                }

                const patientData = await pRes.json();
                const exerciseData = await eRes.json();
                const appointmentData = await aRes.json();
                const userData = await uRes.json();
                const noteData = await nRes.json();
                const assignedData = await assignedRes.json();
                const allPostsData = await allPostsRes.json();

                setPatientName(userData.users[0].first_name + ' ' + userData.users[0].last_name);
                setMedicalHistory(patientData.patients[0].medical_history);
                setNotes(noteData.doctor_patient_relationship[0].notes || '');
                setNewNotes(noteData.doctor_patient_relationship[0].notes || '');

                setPatient(patientData.patients);
                setExercises(exerciseData.patient_exercise_assignments || []);
                setAppointments(appointmentData.appointments || []);
                setAssignedExercises(assignedData.patient_exercise_assignments || []);

                const onlyExercisePlans = allPostsData.forum_posts.filter(post => post.post_type === 'Exercise Plan');
                setAllExercisePlans(onlyExercisePlans);

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
            setLoading(false);
        }

        fetchAll();
    }, [patient_id]);

    const handleSaveNotes = async () => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setEditingNotes(false);

        try {
            await fetch(`/api/betteru/doctor_patient_relationship/${user_info.user_id}/${patient_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ notes: newNotes }),
            });
            setNotes(newNotes);
        } catch (error) {
            console.error("Failed to save notes:", error);
        }
    };

    const handleAssignExercise = async (exerciseId) => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        try {
            await fetch(`/api/betteru/patient_exercise_assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ doctor_id: user_info.user_id, patient_id: patient_id, exercise_id: exerciseId })
            });
            setShowAssignModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to assign exercise:', error);
        }
    };

    const handleCreateAndAssignExercise = async () => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        try {
            const createRes = await fetch(`/api/betteru/forum_posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_id: user_info.user_id,
                    title: newExerciseTitle,
                    content: newExerciseContent,
                    post_type: 'Exercise Plan'
                })
            });

            const createData = await createRes.json();
            const newPostId = createData.post.id;

            await handleAssignExercise(newPostId);
        } catch (error) {
            console.error('Failed to create and assign exercise:', error);
        }
    };

    const handleDeleteExercise = async (assignmentId) => {
        try {
            await fetch(`/api/betteru/patient_exercise_assignments/${assignmentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete exercise:', error);
        }
    };

    if (loading) return <p>Loading patient info...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!patient) return <p>No patient data found.</p>;

    return (
        <div className="patient-info-wrapper">
            <h1>Patient: {patientName}</h1>

            <h2>Assigned Exercises</h2>
            <div className="container mt-4">
                <div className="notes-container">
                    {assignedExercises.length > 0 ? (
                        <ul>
                            {assignedExercises.map((assignment, i) => (
                                <li key={i} style={{ marginBottom: '10px' }}>
                                    <a href={`/forum/post/${assignment.exercise_id}`}>{assignment.exercise_name || `Exercise ${assignment.exercise_id}`}</a>
                                    <button 
                                        onClick={() => handleDeleteExercise(assignment.assignment_id)} 
                                        style={{ marginLeft: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No exercises assigned.</p>
                    )}

                    <div className="exercise-buttons-container">
                        <button className="exercise-button" onClick={() => setShowAssignModal(true)}>Add Exercise</button>
                        <button className="exercise-button" onClick={() => setShowCreateModal(true)}>Create Exercise</button>
                    </div>
                </div>
            </div>

            {showAssignModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign Exercise</h5>
                                <button type="button" className="close" onClick={() => setShowAssignModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    placeholder="Search exercises..."
                                    value={searchExercise}
                                    onChange={(e) => setSearchExercise(e.target.value)}
                                    style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
                                />
                                <ul>
                                    {allExercisePlans.filter(post =>
                                        post.title.toLowerCase().includes(searchExercise.toLowerCase())
                                    ).map((post) => (
                                        <li key={post.id} style={{ marginBottom: '10px' }}>
                                            {post.title}
                                            <button
                                                style={{ marginLeft: '10px' }}
                                                onClick={() => handleAssignExercise(post.id)}
                                            >
                                                Assign
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="create-post-overlay">
                    <div className="create-post-modal">
                        <h2 className="modal-title">Create New Exercise</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newExerciseTitle}
                            onChange={(e) => setNewExerciseTitle(e.target.value)}
                            className="modal-input"
                        />
                        <textarea
                            placeholder="Write exercise details..."
                            value={newExerciseContent}
                            onChange={(e) => setNewExerciseContent(e.target.value)}
                            className="modal-textarea"
                        />
                        <div className="modal-buttons">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAndAssignExercise}
                                className="submit-button"
                            >
                                Create Exercise
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Medical History</h2>
            <div className="container mt-4">
                <div className="border p-3" style={{ maxHeight: '400px', overflowY: 'scroll', backgroundColor: '#f8f9fa', whiteSpace: 'pre-wrap' }}>
                    {medicalHistory}
                </div>
            </div>

            <h2>Previous Appointments</h2>
            <div className="container border p-3 mb-4" style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                {appointments.length > 0 ? (
                    <ul className="list-unstyled">
                        {appointments.map((appt, i) => {
                            const validDate = isNaN(Date.parse(appt.start_time)) ? 'Invalid date' : new Date(appt.start_time).toLocaleDateString();
                            return (
                                <li key={i} className="mb-3 p-2">
                                    <strong>{validDate}</strong> - <em>{appt.reason}</em>
                                    <div><strong>Status:</strong> {appt.status || 'N/A'}</div>
                                    <div><strong>Notes:</strong> {appt.notes || 'No notes'}</div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No previous appointments.</p>
                )}
            </div>

            <h2>Doctor Notes</h2>
            <div className="container mt-4 d-flex justify-content-center">
                <div className="notes-container">
                    {editingNotes ? (
                        <>
                            <textarea
                                className="notes-textarea"
                                value={newNotes}
                                onChange={(e) => setNewNotes(e.target.value)}
                            />
                            <button className="save-notes-button" onClick={handleSaveNotes}>Save</button>
                        </>
                    ) : (
                        <>
                            <p>{notes || "No notes added."}</p>
                            <button className="edit-notes-button" onClick={() => setEditingNotes(true)}>Edit Notes</button>
                        </>
                    )}
                </div>
            </div>

            <button 
                onClick={() => navigate(`/doctor/prescribe/${patient_id}`)} 
                style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#FF5354", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "50px", marginLeft: "100px" }}
            >
                Prescribe Medication
            </button>
        </div>
    );
}

export default DoctorPatientInfo;
