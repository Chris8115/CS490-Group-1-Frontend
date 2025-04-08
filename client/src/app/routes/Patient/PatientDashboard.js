
import DashboardItem from "../../../components/DashboardItem";

function PatientDashboard() {
    return <>
        <h1>Dashboard</h1>

        <div style = {{ display: 'flex', flexDirection: "column" }} >
            <DashboardItem itemName="Write a Review" itemDescription="Write out a review for your doctor." href="/patient/review" icon="DashboardTestIcon" />
            <DashboardItem itemName="Book an Appointment" itemDescription="Schedule an appointment with your doctor." href="/patient/book-appointment" icon="DashboardTestIcon" />   
            <DashboardItem itemName="Cancel Appointment" itemDescription="Cancel any scheduled appointments." href="/patient/cancel-appointment" icon="DashboardTestIcon" />   
            <DashboardItem itemName="View Progress" itemDescription="Detailed overview on weight loss thus far." href="/patient/progress" icon="DashboardTestIcon" />   
            <DashboardItem itemName="View Prescriptions" itemDescription="View currently assigned prescriptions." href="/patient/prescriptions" icon="DashboardTestIcon" />   
        </div>

    </>
}

export default PatientDashboard;