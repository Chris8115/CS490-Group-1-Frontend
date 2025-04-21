
import { useEffect, useState } from 'react';
import '../css/doctor-search.css'
import { use } from 'react';

function PharmacyDeliveryStatus(props) {
    const [deliveryPatient, setDeliveryPatient] = useState([]);
    
    const order = props.order;
    
    
    const fetchPatientDetails = async () => {

        const response = await fetch(`/api/pharmacy/patient/${order.patient_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        
        const data = await response.json();
        console.log(data);
        //setDeliveryPatient(data.orders);

    }

    useEffect(() => {
        fetchPatientDetails();
    }, [])

    return <>
    
    <div className="doctor-search">
        <h3>Order #{order.order_id}</h3>
        {/*<h4 style={{color: '#696969'}} >{patientDetails.specialization}</h4>*/}
        <h4><strong>{order.status.toUpperCase()}</strong></h4>
        <p>Medication Name: {order.name}</p>
        <p>Medication Recipient: </p>
    </div>

    </>
}
export default PharmacyDeliveryStatus;