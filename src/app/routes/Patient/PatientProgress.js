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
    const [progressData, setProgressData] = useState([]); // Daily
    const [weeklyProgressData, setWeeklyProgressData] = useState([]); // Weekly
    const [loading, setLoading] = useState(true);
    const [exerciseAssignments, setExerciseAssignments] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [dailySurveySubmitted, setDailySurveySubmitted] = useState(false);
    const [weeklySurveySubmitted, setWeeklySurveySubmitted] = useState(false);

    useEffect(() => {
        if (!userInfo?.user_id) return; 

        const getProgress = async () => {
            try {
                const response = await fetch(`/api/betteru/patient_progress?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
      
                });

                const data = await response.json();
                if (!response.ok) throw new Error('Request Failed');

                
                const weeklyResponse = await fetch(`/api/betteru/patient_weekly_surveys?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
      
                });

                const weeklyData = await weeklyResponse.json();
                if (!weeklyResponse.ok) throw new Error('Request Failed');
                
                //console.log("Daily: ", data)
                //console.log("Weekly: ", weeklyData)
                
                const progress = data.patient_progress.slice(0, 20);
                
                const newChart = structuredClone(chartTemplate);
                newChart["labels"] = [];
                progress.reverse().map((progressLog, index) => {
                    newChart["labels"].push(progressLog.date_logged.split(" ")[0]);
                    newChart["datasets"][0]["data"].push(progressLog.weight);
                })
                
                // Reverses twice because reverse() doesn't return a new array but just flips the old one
                setProgressData(progress.reverse());
                setWeeklyProgressData(weeklyData.patient_weekly_surveys.reverse());

                setChartData(newChart);
                setLoading(false);

                if (weeklyData.patient_weekly_surveys[0]) {
                    setWeeklySurveySubmitted(weeklySurveyCheck(weeklyData.patient_weekly_surveys[0].submitted_at));
                }

                
                if (progress[0]) {
                    setDailySurveySubmitted(dailySurveyCheck(progress[0].date_logged));
                }

                
            } catch (e) {
                console.log(e);
            }
        }

        const getAssignments = async () => {
            try {
                const response = await fetch(`/api/betteru/patient_exercise_assignments?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include'
      
                });

                if (!response.ok) throw new Error('Request Failed');
                
                const data = await response.json();
                

                const assignments = data.patient_exercise_assignments;

                //console.log(assignments);

                setExerciseAssignments(assignments);
                await getExercises(assignments);

            } catch (e) {
                console.error(e);
            }
        }

        const getExercises = async (assignments) => {
            try {
                const exerciseIds = assignments.map(item => item.exercise_id);

                const fetches = exerciseIds.map(id => 
                    fetch(`/api/betteru/forum_posts?post_id=${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })
                    .then(res => {
                        if (!res.ok) {
                            console.error(res);
                        } else {
                            return res.json();
                        }
                    })
                )

                const results = await Promise.all(fetches);
                setExercises(results.map(res => res.forum_posts[0]));

            } catch (e) {
                console.error(e);
            }
        }

        getProgress();
        getAssignments();
        
    }, [userInfo]);
      
    const handleDailySurveySubmit = async (e) => {
        e.preventDefault();

        try {
            const surveyForm = new FormData(e.target);
            
            const data = {
                "calories": Number(surveyForm.get("calories")),
                "weight": Number(surveyForm.get("recordedWeight")),
                "water_intake": Number(surveyForm.get("waterIntake")),
                "patient_id": userInfo.user_id
            }
        
            //console.log("Submitting: ", data);
        
            const res = await fetch('/api/betteru/patient_progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const result = await res.json();
            setDailySurveySubmitted(true);
            
        } catch (err) {
            console.error(err);
        }
    }
      
    const handleWeeklySurveySubmit = async (e) => {
        e.preventDefault();

        try {
            const surveyForm = new FormData(e.target);
            
            const data = {
                "weight_goal": Number(surveyForm.get("weightGoal")),
                "comments": surveyForm.get("notes"),
                "patient_id": userInfo.user_id
            }
        
            const res = await fetch('/api/betteru/patient_weekly_surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const result = await res.json();
            //console.log(result);
            setWeeklySurveySubmitted(true);
            
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return <>Loading...</>;
    }


    return <>
    
    <h1>Progress</h1>
    
    <Divider />
    
    <br/>
    
        {weeklyProgressData.length > 0 ? (
            <h3><strong>GOAL:</strong> {weeklyProgressData[0].weight_goal} lbs</h3>
        ) : (
            <p>No weekly progress data available.</p>
        )}

        {progressData.length > 0 ? (
            <h3><strong>Last recorded weight:</strong> {progressData[0].weight} lbs</h3>
        ) : (
            <p>No daily progress data available.</p>
        )}
        
        {(chartData && progressData.length > 0) && (
            <Line data={chartData} />
        )}

        <br/>

        <h2>Exercises</h2>

        <div>

            <table className="table table-hover table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Sets</th>
                        <th scope="col">Reps</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>

                    {exercises.length > 0 && exerciseAssignments.map((assignment, idx) => (
                    <tr key={idx}>
                        <th scope="row">{idx+1}</th>
                        <td><a href={`/post/${exercises[idx].post_id}`} style={{ textDecoration: 'underline', color: '#007bff' }} >{exercises[idx].title}</a></td>
                        <td>{exerciseAssignments[idx].sets}</td>
                        <td>{exerciseAssignments[idx].reps}</td>
                        <td>{exercises[idx].content}</td>
                    </tr>
                    ))}

                </tbody>

            </table>

        </div>

        <br/>

        <h2>Daily Survey</h2>
        {dailySurveySubmitted ? (
            <p>Daily survey submitted.</p>
        ) : (
            <form onSubmit={handleDailySurveySubmit}>
                <div className="survey-container">
                    <label htmlFor="calories" className="form-label">Calorie Intake</label>
                    <input type="number" className="form-control" id="calories" name="calories" min="0" max="40000" required/>
                    
                    <label htmlFor="recordedWeight" className="form-label">Recorded Weight (lbs.)</label>
                    <input type="number" className="form-control" id="recordedWeight" name="recordedWeight" min="1" max="1500" required/>
                    
                    <label htmlFor="waterIntake" className="form-label">Water Intake (liters)</label>
                    <input type="number" step="0.1" className="form-control" id="waterIntake" name="waterIntake" min="0" max="50" required/>
                    
                    <br/>

                    <button type="submit" className="btn btn-primary">Submit Survey</button>
                </div>
            </form>
        )}

        <h2>Weekly Survey</h2>

        {weeklySurveySubmitted ? (
            <p>Weekly survey submitted.</p>
        ) : (
            <form onSubmit={handleWeeklySurveySubmit}>
                <div className="survey-container">
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

const dailySurveyCheck = (dateString) => {
    const inputDate = new Date(dateString);
    inputDate.setHours(inputDate.getHours());
    const now = new Date();
  
    const oneDayAfter = new Date(dateString);
    oneDayAfter.setDate(oneDayAfter.getDate() + 1);

    return inputDate <= oneDayAfter;
};

const weeklySurveyCheck = (dateString) => {
    const inputDate = new Date(dateString);
    inputDate.setHours(inputDate.getHours());
    const now = new Date();
  
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
  
    return inputDate >= oneWeekAgo && inputDate <= now;
};

export default PatientProgress;