
import { useEffect, useState } from 'react';
import '../css/doctor-search.css'
import { use } from 'react';

function PharmacyMedicationDetails(props) {
    const [inventory, setInventory] = useState([]);
    const [medicationUsers, setMedicationUsers] = useState({});
    
    const medication = props.medication;
    

    const fetchInventoryDetails = async () => {

        const response = await fetch(`/api/pharmacy/inventory?medication_id=${medication.medication_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        
        const data = await response.json();
        setInventory(data.inventory[0]); // Assumes each drug only has 1 row associated with it in the inventory
    }


    const fetchUsers = async() => {
        const fetchUserDetails = async (patientIds) => {
            try {
                const names = {}

                await Promise.all(
                    patientIds.map(async (patientId) => {
                        const patientResponse = await fetch(`/api/pharmacy/patients?patient_id=${patientId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include'
                        });

                        
                        if (!patientResponse.ok) throw new Error("Failed to fetch patient");
                        const data = await patientResponse.json();
                        names[patientId] = `${data.patients[0].first_name} ${data.patients[0].last_name}`;
                    })
                )
                
                setMedicationUsers(names);

            } catch (e) {
                console.error(e);
            }
        }

        // Get the IDs of all patients who use this drug
        const response = await fetch(`/api/pharmacy/orders?medication_id=${medication.medication_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        const drugPatients = [];
        for (let i = 0; i < data.orders.length; i++) {
            drugPatients.push(data.orders[i].patient_id);
        }

        fetchUserDetails(drugPatients);

    }

    useEffect(() => {
        fetchInventoryDetails();
        fetchUsers();
    }, [])

    return <>
    
    <div className="doctor-search">
        <h3>{medication.medication_id}: {medication.name}</h3>
        <p>{medication.description}</p>
        <p>Stock: {inventory.stock}</p>
        {Object.keys(medicationUsers).length > 0 && (
            <>
                <p>Users:</p>
                <ul>
                    {Object.entries(medicationUsers).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
            </>
        )}
    </div>
    

    </>
}
export default PharmacyMedicationDetails;