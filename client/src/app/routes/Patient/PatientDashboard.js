
import { useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import { Card } from "react-bootstrap";


function PatientDashboard() {

    const getPatientAppointments = async() => {
        console.log("Duuuude.");
    }

    useEffect(() => {
        console.log("AAA");
        getPatientAppointments();
    }, [])

    return <>
        <h1>Dashboard</h1>
        <div style = {{ display: 'flex', flexDirection: "column" }} >
            <DashboardItem itemName="Write a Review" itemDescription="Write out a review for your doctor." href="/patient/review" icon="DashboardTestIcon" />
            <DashboardItem itemName="Book an Appointment" itemDescription="Schedule an appointment with your doctor." href="/patient/book-appointment" icon="DashboardTestIcon" />   
            <DashboardItem itemName="View Progress" itemDescription="Detailed overview on weight loss thus far." href="/patient/progress" icon="DashboardTestIcon" />   
            <DashboardItem itemName="View Prescriptions" itemDescription="View currently assigned prescriptions." href="/patient/prescriptions" icon="DashboardTestIcon" />   
        </div>

        <h1>Appointments</h1>
        <div class="card" style={{width: 18 + 'rem'}}>
            <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="card-link">Card link</a>
                <a href="#" class="card-link">Another link</a>
            </div>
        </div>

    </>
}

export default PatientDashboard;