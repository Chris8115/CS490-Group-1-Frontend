import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/patient_info.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { user_info } from '../../UserContext';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    const [exerciseFrequency, setExerciseFrequency] = useState('');
    const [exerciseSets, setExerciseSets] = useState('');
    const [exerciseReps, setExerciseReps] = useState('');
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState('');
    const [editingNotes, setEditingNotes] = useState(false);
    const [newNotes, setNewNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMessagePatientModal, setShowMessagePatientModal] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");

    const [progressData, setProgressData] = useState([]);
    const [weeklySurveys, setWeeklySurveys] = useState([]);
    const [chartData, setChartData] = useState({});


    useEffect(() => {
        async function fetchAll() {
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
                setMedicalHistory(patientData.patients[0].medical_history || '');
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

    useEffect(() => {
        async function fetchProgress() {
            try {
                const res = await fetch(`/api/betteru/patient_progress?patient_id=${patient_id}`);
                if (!res.ok) throw new Error('Failed to fetch progress');
                const data = await res.json();
    
                const progress = data.patient_progress.slice(0, 20).reverse();
    
                const chart = {
                    labels: progress.map(p => p.date_logged.split(' ')[0]),
                    datasets: [
                        {
                            label: 'Weight',
                            data: progress.map(p => p.weight),
                            fill: false,
                            borderColor: '#42a5f5',
                            tension: 0.1,
                            pointRadius: 5,
                            pointBackgroundColor: '#42a5f5',
                        },
                    ],
                };
    
                setProgressData(progress.reverse());
                setChartData(chart);
            } catch (e) {
                console.error(e);
            }
        }
    
        async function fetchWeeklySurveys() {
            try {
                const res = await fetch(`/api/betteru/patient_weekly_surveys?patient_id=${patient_id}`);
                if (!res.ok) throw new Error('Failed to fetch weekly surveys');
                const data = await res.json();
                setWeeklySurveys(data.patient_weekly_surveys.reverse());
            } catch (e) {
                console.error(e);
            }
        }
    
        fetchProgress();
        fetchWeeklySurveys();
    }, [patient_id]);

    const handleSaveNotes = async () => {
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
        const payload = {
            doctor_id: user_info.user_id,
            patient_id: patient_id,
            exercise_id: exerciseId,
            frequency_per_week: parseInt(exerciseFrequency) || 1,
            sets: parseInt(exerciseSets) || 1,
            reps: parseInt(exerciseReps) || 1
        }

        console.log(payload);

        try {
            await fetch(`/api/betteru/patient_exercise_assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            setShowAssignModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to assign exercise:', error);
            alert('Please enter all details before submitting.');
        }
    };

    

    const handleCreateAndAssignExercise = async () => {

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
            const newPostId = createData.id;

            await handleAssignExercise(newPostId);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Failed to create and assign exercise:', error);
            alert('Please enter all details before submitting.');
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

    function sendMessage() {
        fetch(`/api/betteru/users?user_id=${user_info.user_id}`)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'email_subject': `A message from your doctor.`,
                  'email_body': `Dr. ${data.users[0].last_name} has sent you a message: \r\n\r\n${emailMessage}\r\n\r\nTo reply, log into your Dashboard and send them a message.`
                })
              };
            fetch(`/api/betteru/mail/${patient_id}`, requestOptions)
            .then(resp => resp.json())
            .then(data => {
                alert(data.message);
            })
        })
    }

    return (
        <>
            <h1>Patient: {patientName}</h1>

            <h2>Assigned Exercises</h2>
            <div className="container mt-4">
                <div className="notes-container">
                    {assignedExercises.length > 0 ? (
                        <ul>
                        {assignedExercises.map((assignment, i) => {
                          const post = allExercisePlans.find(p => p.post_id === assignment.exercise_id);
                          const exerciseTitle = post ? post.title : `Exercise ${assignment.exercise_id}`;
                          
                          return (
                            <li key={i} style={{ marginBottom: '10px' }}>
                              <a href={`/post/${assignment.exercise_id}`}>
                                {exerciseTitle} | {assignment.sets || 1} sets, {assignment.reps || 1} reps, {assignment.frequency_per_week || 1} times/week, 
                              </a>
                              <button 
                                onClick={() => handleDeleteExercise(assignment.assignment_id)} 
                                style={{ marginLeft: '10px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </li>
                          );
                        })}
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
                                <input type="text" placeholder="Search exercises..." value={searchExercise} onChange={(e) => setSearchExercise(e.target.value)} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
                                <input type="number" placeholder="Frequency per week" value={exerciseFrequency} onChange={(e) => setExerciseFrequency(e.target.value)} className="modal-input" />
                                <input type="number" placeholder="Sets" value={exerciseSets} onChange={(e) => setExerciseSets(e.target.value)} className="modal-input" />
                                <input type="number" placeholder="Reps" value={exerciseReps} onChange={(e) => setExerciseReps(e.target.value)} className="modal-input" />
                                <ul>
                                    {allExercisePlans.filter(post => post.title.toLowerCase().includes(searchExercise.toLowerCase())).map((post) => (
                                        <li key={post.id} style={{ marginBottom: '10px' }}>
                                            {post.title}
                                            <button style={{ marginLeft: '10px' }} onClick={() => handleAssignExercise(post.post_id)}>Assign</button>
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
                        <input type="text" placeholder="Title" value={newExerciseTitle} onChange={(e) => setNewExerciseTitle(e.target.value)} className="modal-input" />
                        <textarea placeholder="Write exercise details..." value={newExerciseContent} onChange={(e) => setNewExerciseContent(e.target.value)} className="modal-textarea" />
                        <input type="number" placeholder="Frequency per week" value={exerciseFrequency} onChange={(e) => setExerciseFrequency(e.target.value)} className="modal-input" />
                        <input type="number" placeholder="Sets" value={exerciseSets} onChange={(e) => setExerciseSets(e.target.value)} className="modal-input" />
                        <input type="number" placeholder="Reps" value={exerciseReps} onChange={(e) => setExerciseReps(e.target.value)} className="modal-input" />
                        <div className="modal-buttons">
                            <button onClick={() => setShowCreateModal(false)} className="cancel-button">Cancel</button>
                            <button onClick={handleCreateAndAssignExercise} className="submit-button">Create Exercise</button>
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
            <div className="container border p-4 mb-4" style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                {appointments.length > 0 ? (
                    <ul className="list-unstyled">
                        {appointments.map((appt, i) => {
                            const validDate = isNaN(Date.parse(appt.start_time)) ? 'Invalid date' : new Date(appt.start_time).toLocaleDateString();
                            return (
                                <li key={i} className="mb-3 p-2">
                                    <strong>{validDate}</strong> - <em>{appt.reason}</em>
                                    <div><strong>Status:</strong> {appt.status.toUpperCase() || 'N/A'}</div>
                                    <div><strong>Notes:</strong> {appt.notes || 'N/A'}</div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No previous appointments.</p>
                )}
            </div>

            <h2>Doctor Notes</h2>
            <div className="container border mb-4 p-4" style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                <div>
                    {editingNotes ? (
                        <>
                            <textarea className="notes-textarea" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
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

            <h2>Patient Progress</h2>
            <div style={{marginRight: '100px', marginLeft: '100px'}}>
                {chartData && chartData.labels && chartData.labels.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>No progress data available.</p>
                )}
            </div>
            

            <h2>Daily Surveys</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginRight: '100px', marginLeft: '100px' }}>
                {progressData.length > 0 ? (
                    <table className="table-daily-survey">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Weight</th>
                                <th>Calories</th>
                                <th>Water Intake</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progressData.map((entry, idx) => (
                                <tr key={idx}>
                                    <td>{entry.date_logged.split(' ')[0]}</td>
                                    <td>{entry.weight}</td>
                                    <td>{entry.calories}</td>
                                    <td>{entry.water_intake}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No daily surveys available.</p>
                )}
            </div>

            <h2>Weekly Surveys</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', whiteSpace: 'pre-wrap', marginRight: '100px', marginLeft: '100px' }}>
                {weeklySurveys.length > 0 ? (
                    weeklySurveys.map((survey, idx) => (
                        <div key={idx} style={{ marginBottom: '1rem' }}>
                            <strong>Date:</strong> {survey.submitted_at.split(' ')[0]} <br />
                            <strong>Goal Weight:</strong> {survey.weight_goal} lbs <br />
                            <strong>Notes:</strong> {survey.comments}
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>No weekly surveys available.</p>
                )}
            </div>

            <button 
                onClick={() => navigate(`/doctor/prescribe/${patient_id}`)} 
                style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#FF5354", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "50px", marginLeft: "100px", marginRight: "50px" }}
            >
                Prescribe Medication
            </button>

            <button type="button" className="btn btn-success" style={{ padding: "10px 20px"}} onClick={() => setShowMessagePatientModal(true)}>Message Patient</button>
            {showMessagePatientModal && (<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Message Patient</h5>
                            <button type="button" className="close" onClick={() => setShowMessagePatientModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                            <p>Enter the message to your patient below</p>
                            <input type="text" onChange={(e)=>{setEmailMessage(e.target.value)}}></input>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={() => setShowMessagePatientModal(false)} >Close</button>
                                <button type="button" className="btn btn-success" onClick={sendMessage} >Send Message</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    );
}

export default DoctorPatientInfo;
