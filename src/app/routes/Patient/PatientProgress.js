import Divider from '../../../components/Divider';
import '../../../css/dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useUser } from '../../UserContext';
import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBBtn
} from 'mdb-react-ui-kit';
import '../../../css/survey.css'


import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartTemplate = {
    labels: [], // X-Axis labels
    datasets: [
      {
        label: 'Weight',
        data: [], // Data points for the line
        fill: false, // No fill under the line
        borderColor: '#42a5f5', // Line color
        tension: 0.1, // Smoothness of the line
        pointRadius: 5, // Size of the points
        pointBackgroundColor: '#42a5f5', // Color of the points
      },
    ],
  };

function PatientProgress() {
    const { userInfo } = useUser();
    const [chartData, setChartData] = useState({});
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exerciseAssignment, setExerciseAssignment] = useState([]);
    const [surveySubmitted, setSurveySubmitted] = useState(false);

    useEffect(() => {
        if (!userInfo?.user_id) return; 

        const getProgress = async () => {
            try {
                const response = await fetch(`/patient_progress?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
      
                });

                if (!response.ok) throw new Error('Request Failed');
                
                const data = await response.json();
                
                console.log(data)

                const progress = data.patient_progress.slice(0, 8);
                
                const newChart = structuredClone(chartTemplate);
                newChart["labels"] = [];
                progress.reverse().map((progressLog, index) => {
                    newChart["labels"].push(progressLog.date_logged.split(" ")[0]);
                    newChart["datasets"][0]["data"].push(progressLog.weight);
                })
                
                // Reverses twice because reverse() doesn't return a new array but just flips the old one
                setProgressData(progress.reverse());
                setChartData(newChart);
                setLoading(false);

                setSurveySubmitted(surveyCheck(progress[0].date_logged));

                
            } catch (e) {
                console.log(e);
            }
        }

        const getAssignments = async () => {
            try {
                const response = await fetch(`/patient_exercise_assignments?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
      
                });

                if (!response.ok) throw new Error('Request Failed');
                
                const data = await response.json();
                
                console.log(data)

                setExerciseAssignment(
                    data.patient_exercise_assignments.map(item => item.instructions)
                );

            } catch (e) {
                console.log(e);
            }
        }

        getProgress();
        getAssignments();
        
    }, [userInfo]);
      
    const handleSurveySubmit = async (e) => {
        e.preventDefault();

        try {
            const surveyForm = new FormData(e.target);
            
            const data = {
                "calories": Number(surveyForm.get("calories")),
                "weight": Number(surveyForm.get("recordedWeight")),
                "weight_goal": Number(surveyForm.get("weightGoal")),
                "notes": surveyForm.get("notes"),
                "patient_id": userInfo.user_id
            }
        
        
            const res = await fetch('/patient_progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const result = await res.json();
            console.log(result);
            setSurveySubmitted(true);
            
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return <>Loading...</>;
    }

    if (!progressData.length || !chartData) {
        return <>No progress data available.</>;
    }
    return <>
    
    <h1>Progress</h1>
    
    <Divider />
    
    <br/>
    
        <h2><strong>GOAL:</strong> {progressData[0].weight_goal} lbs</h2>
        <h3><strong>Last recorded weight:</strong> {progressData[0].weight} lbs</h3>
        
        <Line data={chartData} />

        <br/>

        <h2>Exercises</h2>
        <ul>
            {exerciseAssignment.map((text, idx) => (
                <h4><li key={idx}>{text}</li></h4>
            ))}
        </ul>

        <h2>Weekly Survey</h2>

        {surveySubmitted ? (
            <p>Weekly survey submitted.</p>
        ) : (
            <form onSubmit={handleSurveySubmit}>
                <div className="survey-container">
                    <label htmlFor="calories" className="form-label">Calorie Intake</label>
                    <input type="number" className="form-control" id="calories" name="calories" min="0" max="40000" required/>
                    
                    <label htmlFor="recordedWeight" className="form-label">Recorded Weight (lbs.)</label>
                    <input type="number" className="form-control" id="recordedWeight" name="recordedWeight" min="1" max="1500" required/>
                    
                    <label htmlFor="weightGoal" className="form-label">Weight Goal (lbs.)</label>
                    <input type="number" className="form-control" id="weightGoal" name="weightGoal" min="1" max="1500" required/>
                    
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <input type="text" className="form-control" id="notes" name="notes"/>

                    <br/>

                    <button type="submit" className="btn btn-primary">Submit Survey</button>
                </div>
            </form>
        )}

    </>
}

const surveyCheck = (dateString) => {
    const inputDate = new Date(dateString);
    const now = new Date();
  
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
  
    return inputDate >= oneWeekAgo && inputDate <= now;
  };

export default PatientProgress;