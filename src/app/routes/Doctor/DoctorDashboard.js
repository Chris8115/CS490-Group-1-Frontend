import { useState, useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import Divider from '../../../components/Divider.js';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../css/doctor_dashboard.css';
import DoctorSettings from "./DoctorSettings.js";
import DoctorPatientView from "./DoctorPatientView.js";
import Appointments from "./Appointments.js";
import PendingAppointments from "./PendingAppointments.js";
import '../../../css/appointments.css';

function DoctorDashboard() {
    const navigate = useNavigate();

    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [date, setDate] = useState(new Date());

const handleCancel = async (appointmentId) => {
        try {
            const response = await fetch(`/appointments`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    appointment_id: appointmentId,
                    status: 'canceled'
                })
            });

            if (!response.ok) throw new Error("Failed to cancel appointment");

            alert("Appointment canceled successfully.");
            // You might want to refetch or filter out canceled ones here

        } catch (err) {
            console.error(err);
            alert("Error canceling appointment.");
        }
    };

    const handleChange = async (newDate) => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setDate(newDate);

        const formattedDate = newDate.toISOString().split('T')[0];

        try {
            const response = await fetch(`/appointments?doctor_id=${user_info.user_id}&start_time=${formattedDate}&status=accepted`);
            if (!response.ok) throw new Error('Failed to fetch appointments');

            const appointments = await response.json();
            setDoctorAppointments(appointments);

        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const getPendingAppointments = async () => {
        try {
            const response = await fetch(`/appointments?doctor_id=${userInfo.user_id}&status=pending`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch pending appointments');

            const data = await response.json();
            setPendingAppointments(data);
            // console.log("pending");
            // console.log(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setUserInfo(user_info);

        handleChange(date); // Load current day appointments
    }, []);

    useEffect(() => {
        if (userInfo.user_id) {
            getPendingAppointments(); // Fetch pending appointments once userInfo is set
        }
    }, [userInfo]);

    return (
        <div>
            <h1>Dashboard</h1>
            <Divider />

            <h2>View Appointments</h2>
            <div className="appointments-container">
                <div className="calendar-panel">
                    <Calendar onChange={handleChange} value={date} />
                </div>
                <div className="appointments-panel">
                    {doctorAppointments.appointments?.length === 0 ? (
                        <p>No appointments for today.</p>
                    ) : (
                        <Appointments
                            appointments={doctorAppointments.appointments || []}
                            refreshAppointments={() => handleChange(date)}
                        />
                    )}
                </div>
            </div>

            <div>
                <h2>Pending Appointments</h2>
                <PendingAppointments appointments={pendingAppointments.appointments || []} setAppointments={setPendingAppointments} />
            </div>

            <Divider />
            
            <div className='doctor-features'>
                <DashboardItem
                    itemName="View Patients"
                    itemDescription="View current patients"
                    href="/doctor/view-patients"
                    icon="user_icon"
                />
                <DashboardItem
                    itemName="Account and Appointment Settings"
                    itemDescription="Set public account details and appointment settings"
                    href="/doctor/settings"
                    icon="gear"
                />
            </div>

            <br />
        </div>
    );
}

export default DoctorDashboard;
