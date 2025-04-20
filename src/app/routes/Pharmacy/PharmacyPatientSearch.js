import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { useState } from "react";
import PharmacyPatientSearchResult from "../../../components/PharmacyPatientSearchResult";

function PharmacyPatientSearch() {
    const { userInfo } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [searchMethod, setSearchMethod] = useState("id"); 


    // ID Search
    useEffect(() => {
        if (!searchTerm) {
            setPatients([]);
            return;
        }

        // This works through id
        const fetchPatients = async () => {
            const response = await fetch(`/api/pharmacy/patient/${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (data.patient) {
                setPatients([data.patient]);
            }
        }

        fetchPatients()

    }, [searchTerm])


    // Update search result
    useEffect(() => {
        console.log(patients);

    }, [patients]);

    return (
        <>        
            <form >
                <label htmlFor="patientId" className="form-label">Patient ID</label>
                <input type="number" id="patientId" placeholder="Input Patient's ID" name="patientId" className="form-control" onChange={(e) => setSearchTerm(e.target.value)}/>
            </form>

            <br />

            {patients.length > 0 && patients.map((patient, idx) => (
                <PharmacyPatientSearchResult patient={patient} key={patient.patient_id}/>
            ))}
    
        </>
    )
}

export default PharmacyPatientSearch;