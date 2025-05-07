import React, { useEffect, useState } from "react";
import '../css/prescription-entry.css'
import { user_info } from "../app/UserContext";

function PatientTransactionEntry(props) {
    const transaction = props.transaction;
    const [creditcardEnding, setCreditcardEnding] = useState("Loading...");
    const [doctorData, setDoctorData] = useState({});
    const [appointment, setAppointment] = useState({});
    console.log(transaction);

    useEffect(() => {
        fetch(`/api/betteru/patients?user_id=${user_info.user_id}`)
        .then(resp => resp.json())
        .then(data => {
            fetch(`/api/betteru/credit_card?creditcard_id=${data.patients[0].creditcard_id}`)
            .then(resp => resp.json())
            .then(data => setCreditcardEnding(data.credit_card[0].card_ending))
        })
        fetch(`/api/betteru/users?user_id=${transaction.doctor_id}`)
        .then(resp => resp.json())
        .then(data => setDoctorData(data.users[0]))
        fetch(`/api/betteru/appointments?appointment_id=${transaction.transaction_id}`)
        .then(resp => resp.json())
        .then(data => setAppointment(data.appointments[0]))
    }, [])

    return (
        <>
            <div className="prescription-entry">
                <h3><strong>
                    Appointment with Dr. {doctorData.last_name}
                </strong></h3>
                <table>
                    <tr>
                        <td><strong>Doctor's Fee: </strong></td>
                        <td>{transaction.doctor_fee}</td>
                    </tr>
                    <tr>
                        <td><strong>Service Fee: </strong></td>
                        <td>{transaction.service_fee}</td>
                    </tr>
                    <tr>
                        <td><strong>Subtotal: </strong></td>
                        <td>{transaction.doctor_fee}</td>
                    </tr>
                </table>
                <p>Charged to credit card ending in {creditcardEnding}</p>
                <p>Date of charge: {transaction.created_at}</p>
            </div>
        </>
    )
}

export default PatientTransactionEntry;