import { monthDayYear, hourMinute } from "../utils/DateFormatter";

// itemName: The big bold text
// itemDescription: The expanded text
// icon: The asset in the ./assets/ folder used
// href: The page the DashboardItem links to
function PatientAppointmentCard(appointment) {
    return <>
        <div className="card" style={{width: 18 + 'rem'}} key={appointment.appointment_id}>
                <div className="card-body">
                    <h5 className="card-title">{monthDayYear(appointment.start_time)}</h5>
                    {appointmentStatus(appointment.status)}
                    <p className="card-text">
                        {appointment.reason}
                        <br/>
                        <strong>{hourMinute(appointment.start_time)}</strong>
                        <br/>
                        {appointment.location}
                    </p>
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