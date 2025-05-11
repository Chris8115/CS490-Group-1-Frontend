
import { useEffect, useState } from 'react';
import '../css/doctor-search.css'
import { use } from 'react';

function PharmacyDeliveryStatus(props) {
    const [deliveryPatient, setDeliveryPatient] = useState([]);
    const [status, setStatus] = useState('');
    const [stock, setStock] = useState(0);
    const [statusColor, setStatusColor] = useState('black');

    const order = props.order;
    
    const handleCancel = async () => {
        const responseBody = JSON.stringify({
            status: 'rejected',
            medication_id: order.medication_id,
            quantity: order.quantity,
            patient_id: order.patient_id
        });

        const response = await fetch(`/api/pharmacy/orders/${order.order_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: responseBody
        });

        const data = await response.json();
        if (response.status === 200) {setStatus('rejected'); setStatusColor('red');}
    }

    const handleAccept = async () => {
        if (stock < order.quantity) {
            alert("Not enough stock available.");
            return;
        }

        const responseBody = JSON.stringify({
            status: 'accepted',
            medication_id: order.medication_id,
            quantity: order.quantity,
            patient_id: order.patient_id
        });

        const response = await fetch(`/api/pharmacy/orders/${order.order_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: responseBody
        });

        const data = await response.json();
        console.log("Status: ", response.status);
        if (response.status === 200) {setStatus('accepted'); setStatusColor('green');}

    }   

    const fetchPatientDetails = async () => {
        const response = await fetch(`/api/pharmacy/patients?patient_id=${order.patient_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        
        const data = await response.json();
        setDeliveryPatient(data.patients[0]);
    }    

    const fetchMedicationQuantity = async () => {
        const response = await fetch(`/api/pharmacy/inventory?medication_id=${order.medication_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        
        const data = await response.json();
        setStock(data.inventory[0].stock);
    }


    useEffect(() => {
        fetchPatientDetails();
        fetchMedicationQuantity();

        const status = order.status.toLowerCase();
        setStatus(status);
        switch (status) {
            case 'pending': 
                setStatusColor('DarkOrange');
                break;
            
                case 'canceled': 
                setStatusColor('red');
                break;

            case 'rejected': 
                setStatusColor('red');
                break;
    
            case 'accepted': 
                setStatusColor('green');
                break;
            
            case 'ready': 
                setStatusColor('green');
                break;
        };
    }, [])

    return <>

    <tr key={order.order_id}>
        <td>{order.order_id}</td>
        <td style={{ color: statusColor }}><strong>{status.toUpperCase()}</strong></td>
        <td>{order.name}</td>
        <td>{deliveryPatient.last_name}, {deliveryPatient.first_name}</td>
        <td>{order.quantity}</td>
        <td>{stock}</td>
        <td>{status === 'pending' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <button className='btn btn-success' onClick={handleAccept} >Accept Order</button>
                <button className='btn btn-danger' onClick={handleCancel} >Reject Order</button>
            </div>
        )}</td>

    </tr>

    </>
}
export default PharmacyDeliveryStatus;