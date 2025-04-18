
import '../css/doctor-search.css'

function PatientDoctorSearchResult(props) {
    const doctorUser = props.doctorUser;
    const doctorDetails = props.doctorDetails;
    

    return <>
    
    <div className="doctor-search">
        <h3>Dr. {doctorUser.last_name}</h3>
        <h4 style={{color: '#696969'}} >{doctorDetails.specialization}</h4>
        <p>{doctorDetails.profile}</p>
    </div>

    </>
}
export default PatientDoctorSearchResult;