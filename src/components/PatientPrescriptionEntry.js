import React, { useEffect, useState } from "react";
import '../css/prescription-entry.css'

function PatientPrescriptionEntry(props) {
    const prescription = props.prescription;
    const [medicationData, setMedicationData] = useState({});
    const [pharmacyData, setPharmacyData] = useState({});
    
    console.log(prescription);

    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response = await fetch(`/api/betteru/medications?medication_id=${prescription.medication_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                setMedicationData(data);
            } catch (e) {
                console.error(e);
            }
        }

        const fetchPharmacy = async () => {
            try {
                const response = await fetch(`/api/betteru/pharmacists?pharmacist_id=${prescription.pharmacist_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                setPharmacyData(data);

            } catch (e) {
                console.error(e);
            }
        }

        fetchMedication();
        fetchPharmacy();
    }, [])

    if (!medicationData.medications || !pharmacyData.pharmacists) {
        return <></>
    }

    return (
        <>
            <div className="prescription-entry">
                <h3><strong>
                    {medicationData.medications[0].name}
                </strong></h3>
                <h3>{prescription.status.toUpperCase()}</h3>
                <p>{medicationData.medications[0].description}</p>
                <p><strong>Instructions: </strong> {prescription.instructions}</p>
                <p><strong>QTY: </strong>{prescription.quantity}</p>
                <p style={{color:"#404040"}}>Address: {pharmacyData.pharmacists[0].pharmacy_location}</p>
            </div>
        </>
    )
}

export default PatientPrescriptionEntry;