import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { useState } from "react";
import PharmacyPatientSearchResult from "../../../components/PharmacyPatientSearchResult";

function PharmacyPatientSearch() {
    const { userInfo } = useUser();
    const [searchId, setSearchId] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');
    const [patients, setPatients] = useState([]);
    const [patientOrders, setPatientOrders] = useState([]);


    // ID Search
    useEffect(() => {
        if (!searchId && !searchFirstName && !searchLastName) {
            setPatients([]);
            return;
        }

        const fetchPatientDetails = async () => {
            const response = await fetch(`/api/pharmacy/patients?patient_id=${searchId}&first_name=${searchFirstName}&last_name=${searchLastName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            setPatients(data.patients);
        }

        fetchPatientDetails();

    }, [searchId, searchFirstName, searchLastName])


    // Update search result
    useEffect(() => {
        console.log(patients);

    }, [patients]);

    return (
        <>     
        <h1>Patients</h1>   
            <form >
                <label htmlFor="patientId" className="form-label">Patient ID</label>
                <input type="number" id="patientId" placeholder="Input Patient's ID" name="patientId" className="form-control" onChange={(e) => setSearchId(e.target.value)}/>

                <label htmlFor="patientFirstName" className="form-label">First Name</label>
                <input type="text" id="patientFirstName" placeholder="Input Patient's First Name" name="patientFirstName" className="form-control" onChange={(e) => setSearchFirstName(e.target.value)}/>

                <label htmlFor="patientLastName" className="form-label">Last Name</label>
                <input type="text" id="patientLastName" placeholder="Input Patient's Last Name" name="patientLastName" className="form-control" onChange={(e) => setSearchLastName(e.target.value)}/>
            </form>

            <br />

            {patients.length > 0 && patients.map((patient, idx) => (
                <PharmacyPatientSearchResult patient={patient} key={patient.patient_id}/>
            ))}
    
        </>
    )
}

export default PharmacyPatientSearch;