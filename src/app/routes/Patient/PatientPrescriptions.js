import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import PatientPrescriptionEntry from "../../../components/PatientPrescriptionEntry";

function PatientPrescriptions() {
    const { userInfo } = useUser();
    // Only stores accepted/awaiting prescriptions as that's all the patient sees
    const [patientPrescriptions, setPatientPrescriptions] = useState([]);

    useEffect(() => {
        if (!userInfo?.user_id) return;

        const getPrescriptions = async () => {
            try {
                const response = await fetch(`/api/betteru/prescriptions?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const data = await response.json();

                const prescriptions = [];
                for (let i = 0; i < data.prescriptions.length; i++) {
                    if (data.prescriptions[i].status === "Ready" || data.prescriptions[i].status === "Accepted") {
                        prescriptions.push(data.prescriptions[i]);
                    }
                }

                setPatientPrescriptions(prescriptions);

            } catch (e) {
                console.error(e);
            }
        }

        getPrescriptions();



    }, [userInfo])

    return (
        <>
        
        <h1>Prescriptions</h1>

        <ul>
            {patientPrescriptions.map((prescription, idx) => (
                <PatientPrescriptionEntry prescription={prescription} key={prescription.prescription_id} />
            ))}
        </ul>
        
        </>
    )

}

export default PatientPrescriptions;