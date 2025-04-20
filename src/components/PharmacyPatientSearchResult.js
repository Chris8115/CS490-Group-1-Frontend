
import '../css/doctor-search.css'

function PharmacyPatientSearchResult(props) {
    const patient = props.patient;
    

    return <>
    
    <div className="doctor-search">
        <h3>{patient.last_name}, {patient.first_name}</h3>
        {/*<h4 style={{color: '#696969'}} >{patientDetails.specialization}</h4>*/}
        <p>{patient.medical_history}</p>
    </div>

    </>
}
export default PharmacyPatientSearchResult;