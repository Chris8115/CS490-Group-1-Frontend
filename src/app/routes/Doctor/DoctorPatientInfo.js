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
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exercisePlans, setExercisePlans] = useState({});


    useEffect(() => {
    
        async function fetchAll() {
            const user_info = JSON.parse(sessionStorage.getItem('user_info'));
            try {
                const [pRes, eRes, aRes, uRes, rRes] = await Promise.all([
                    fetch(`/patients?patient_id=${patient_id}`),
                    fetch(`/patient_exercise_assignments?patient_id=${patient_id}`),
                    fetch(`/appointments?patient_id=${patient_id}`),
                    fetch(`/users?user_id=${patient_id}`),
                    fetch(`/doctor_patient_relationship?patient_id=${patient_id}&doctor_id=${user_info.user_id}`), // Get doctor notes from doctor-patient relationship table
                ]);

                if (!pRes.ok || !eRes.ok || !aRes.ok || !uRes.ok || !rRes.ok) {
                    throw new Error("There was an error in loading patient data.");
                }

                const patientData = await pRes.json();
                const exerciseData = await eRes.json();
                const appointmentData = await aRes.json();
                const userData = await uRes.json();
                const noteData = await rRes.json();

                setPatientName(userData.users[0].first_name + ' ' + userData.users[0].last_name);
                setMedicalHistory(patientData.patients[0].medical_history);

                setPatient(patientData.patients);
                setExercises(exerciseData.patient_exercise_assignments || []);
                setAppointments(appointmentData.appointments || []);
                setLoading(false);

                console.log(patientData);


                console.log()


                const plans = {};

                await Promise.all((exerciseData.patient_exercise_assignments || []).flat().map(async (ex) => {
                    const res = await fetch(`/exercise_plans?exercise_id=${ex.exercise_id}`);
                    if (res.ok) {
                    const data = await res.json();
                    plans[ex.exercise_id] = data.plan || data; // adjust depending on your API structure
                    }
                })
                );

                setExercisePlans(plans);

            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        }

        fetchAll();
    }, [patient_id]);

    if (loading) return <p>Loading patient info...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!patient) return <p>No patient data found.</p>;

    return (
        <div className="patient-info-wrapper">
          <h1>Patient: {patientName}</h1>
      
          <h2>Patient Plan (Exercises)</h2>
            <ul>
            {exercises.length > 0 ? (
                exercises.flat().map((ex, i) => (
                <li key={i}>
                    <strong>{ex.name}</strong>
                    {exercisePlans[ex.exercise_id] ? (
                    <ul>
                        {/* Add more fields as needed */}
                    </ul>
                    ) : (
                    <p>Loading plan...</p>
                    )}
                </li>
                ))
            ) : (
                <p>No exercises assigned.</p>
            )}
            </ul>


      
          <h2>Medical History</h2>
        <div className="container mt-4">
        <div
            className="border p-3"
            style={{
            maxHeight: '400px',
            overflowY: 'scroll',
            backgroundColor: '#f8f9fa',
            whiteSpace: 'pre-wrap',
            }}
        >
            {medicalHistory}
        </div>

        <br />
        
        </div>
      
        <h2>Previous Appointments</h2>
        <div
        className="container border p-3 mb-4"
        style={{
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px'
        }}
        >
        {appointments.length > 0 ? (
            <ul className="list-unstyled">
            {appointments.map((appt, i) => {
                const validDate = isNaN(Date.parse(appt.start_time)) 
                ? 'Invalid date' 
                : new Date(appt.start_time).toLocaleDateString();

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
          <ul>
            {notes.length > 0 ? notes.map((note, i) => (
              <li key={i}><em>{note.date}</em>: {note.content}</li>
            )) : <p>No notes added.</p>}
          </ul>
      
          <button 
            onClick={() => navigate(`/doctor/prescribe/${patient_id}`)} 
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#FF5354",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "50px",
              marginLeft: "100px",
            }}
          >
            Prescribe Medication
          </button>
        </div>
      );
      
}

export default DoctorPatientInfo;
