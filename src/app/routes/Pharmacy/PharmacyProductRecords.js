import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { useState } from "react";
import PharmacyMedicationDetails from "../../../components/PharmacyMedicationDetails";

function PharmacyProductRecords() {
    const { userInfo } = useUser();
    const [medications, setMedications] = useState([]);

    const fetchMedications = async () => {
        try {
            const response = await fetch(`/api/pharmacy/medications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            const data = await response.json();
            setMedications(data.medications);
        } catch (e) {
            console.error(e);
        }
    }

    // ID Search
    useEffect(() => {
        fetchMedications();
    }, [])

    return (
        <>
        <h1>Products</h1>   
 
        <table className="table table-hover table-bordered">
            <thead className="thead-dark">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Stock</th>
                    <th>Users</th>
                </tr>
            </thead>
            <tbody>
                {medications.length > 0 && medications.map((medication, idx) => (
                    <PharmacyMedicationDetails medication={medication} key={medication.medication_id}/>
                ))}
            </tbody>
        </table>


        </>
    )
}


        //{medications.length > 0 && medications.map((medication, idx) => (
        //))}
export default PharmacyProductRecords;