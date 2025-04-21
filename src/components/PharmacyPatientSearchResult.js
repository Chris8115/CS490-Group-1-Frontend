
import { useEffect, useState } from 'react';
import '../css/doctor-search.css'
import { use } from 'react';

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

    useEffect(() => {
        fetchPatientOrders();
    }, [])

    return <>
    
    <div className="doctor-search">
        <h3>{patient.last_name}, {patient.first_name}</h3>
        {/*<h4 style={{color: '#696969'}} >{patientDetails.specialization}</h4>*/}
        <p>{patient.medical_history}</p>
        <h4>Orders</h4>
            {patientOrders.map((order, idx) => (
                <span key={order.order_id}><strong>{order.status.toUpperCase()} - {order.medication_id}: {order.name}</strong></span>
            ))}
    </div>

    </>
}
export default PharmacyPatientSearchResult;