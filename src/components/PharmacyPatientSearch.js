
import '../css/doctor-search.css'

function PharmacyPatientSearchResult(props) {
    const patientUser = props.patientUser;
    const patientDetails = props.patientDetails;
    

    return <>
    
    <div className="doctor-search">
        <h3>Dr. {patientUser.last_name}</h3>
        <h4 style={{color: '#696969'}} >{patientDetails.specialization}</h4>
        <p>{patientDetails.profile}</p>
    </div>

    </>
}
export default PharmacyPatientSearchResult;