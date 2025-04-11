import Divider from '../../../components/Divider';
import '../../../css/dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

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
    const [chartData, setChartData] = useState({});
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        const getProgress = async () => {
            try {
                const response = await axios.get("/patient_progress", {
                    params: {
                        "patient_id": 26
                    }
                })

                const progress = response.data.patient_progress.slice(0, 8);
                setProgressData(progress);

                const newChart = structuredClone(chartTemplate);
                newChart["labels"] = [];
                progress.map((progressLog, index) => {
                    newChart["labels"].push(progressLog.date_logged);
                    newChart["datasets"][0]["data"].push(progressLog.weight);
                })
                
                setChartData(newChart);
            } catch (e) {
                console.log(e);
            }
        }
        getProgress();
    }, []);
      
    if (progressData.length == 0 || chartData == {}) {
        return <>Loading</>
    }
    return <>
    
    <h1>Progress</h1>
    <Divider />


    <div className="dashboard-features">
    
        <h2><strong>GOAL:</strong> 199 lbs</h2>
        <h3><strong>Last recorded weight:</strong> {progressData[0].weight} lbs</h3>
        
        <Line data={chartData} />
    
    </div>
    
    </>
}

export default PatientProgress;