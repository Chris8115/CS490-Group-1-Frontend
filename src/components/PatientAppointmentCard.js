import { monthDayYear, hourMinute } from "../utils/DateFormatter";
import '../css/pending_appointments.css';

// itemName: The big bold text
// itemDescription: The expanded text
// icon: The asset in the ./assets/ folder used
// href: The page the DashboardItem links to

const handleCancel = async (appointmentId) => {
    console.log(appointmentId);
    try {
        const response = await fetch(`/api/betteru/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                status: 'canceled'
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error("Failed to cancel appointment");

        alert("Appointment canceled successfully.");
        // You might want to refetch or filter out canceled ones here

    } catch (err) {
        console.error(err);
        alert("Error canceling appointment.");
    }
};

function formatTimeRange(start, end) {
    const format = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${format(start)} - ${format(end)}`;
}

function PatientAppointmentCard(props) {
    const appt = props.appointment;
    return <>
        <div className="appointment-item" key={appt.appointment_id}>
            <div className="appointment-header">
            <p className="patient-name">
            {monthDayYear(appt.start_time)}
            </p>
            <p className="time">{formatTimeRange(appt.start_time, appt.end_time)}</p>
            </div>

            <div>
                {appt.status === "pending" ? (
                    <strong style={{ color: 'orange'}}>Pending</strong>
                ) : (
                    <strong style={{ color: 'green'}}>Confirmed</strong>
                )}
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
    </>
}

function appointmentStatus(status) {
    let statusDisplay = "";
    let textColor = "";
    switch (status) {
        case "canceled":
            statusDisplay = "Canceled";
            textColor = "red";
            break;
        case "rejected":
            statusDisplay = "Rejected";
            textColor = "red";
            break;
        case "accepted":
            statusDisplay = "Accepted";
            textColor = "green";
            break;
        case "pending":
            statusDisplay = "Pending";
            textColor = "DarkOrange"
            break;
        default:
            break;
    }
    return <h5 className="card-subtitle mb-2" style={{color: textColor, fontWeight: 'bold'}}>{statusDisplay}</h5>;
}

export default PatientAppointmentCard;