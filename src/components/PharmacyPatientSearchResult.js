
import { useEffect, useState } from 'react';
import '../css/doctor-search.css'
import { use } from 'react';
import '../css/info_cards.css'

function PharmacyPatientSearchResult(props) {
    const [patientOrders, setPatientOrders] = useState([]);
    
    const patient = props.patient;
    
    
    const fetchPatientOrders = async () => {

        const response = await fetch(`/api/pharmacy/orders?patient_id=${patient.patient_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        
        const data = await response.json();
        setPatientOrders(data.orders);

    }

    const fetchPatientPrescriptions = async () => {

        const response = await fetch(`/api/betteru/prescriptions?patient_id=${patient.patient_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();
        //console.log(data);
    }

    useEffect(() => {
        fetchPatientOrders();
        fetchPatientPrescriptions();
    }, [])

    return <>
    
    <div className="default-card">
        <h3>{patient.last_name}, {patient.first_name}</h3>
        {/*<h4 style={{color: '#696969'}} >{patientDetails.specialization}</h4>*/}
        <p>{patient.medical_history}</p>
        <h4>Orders</h4>
        <ul>
            {patientOrders.map((order, idx) => (
                <li><span key={order.order_id}><strong>{order.status.toUpperCase()} - {order.medication_id}: {order.name}</strong></span></li>
            ))}
        </ul>
        
        
    </div>

    </>
}
export default PharmacyPatientSearchResult;