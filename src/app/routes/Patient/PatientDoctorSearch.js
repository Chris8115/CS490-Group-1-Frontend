import { useEffect } from "react";
import { user_info } from "../../UserContext";
import { useState } from "react";
import PatientDoctorSearchResult from "../../../components/PatientDoctorSearchResult";

function PatientDoctorSearch() {
    //const { userInfo } = useUser();
    const [searchTerm, setSearchTerm] = useState(''); // remove once functional
    const [debouncedTerm, setDebouncedTerm] = useState(''); // remove once functional
    const [nameSearch, setNameSearch] = useState('');
    const [specializationSearch, setSpecializationSearch] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState([]);

    useEffect(() => {

        const fetchDoctors = async () => {
            try {
                    const detailsResponse = await fetch(`/api/betteru/doctors?specialization=${specializationSearch}&last_name=${nameSearch}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include'
                    });

                    const detailsData = await detailsResponse.json();
                    console.log(detailsData);
                    setDoctorDetails(detailsData.doctors);
            
            } catch (e) {
                console.error(e);
            }
        } 

        fetchDoctors();

    }, [nameSearch, specializationSearch])

    return (
        <>        
            <form >
                <label htmlFor="doctorName" className="form-label">Doctor Name</label>
                <input type="text" id="doctorName" placeholder="Search for doctors" name="doctorName" className="form-control" onChange={(e) => setNameSearch(e.target.value)}/>
                
                <label htmlFor="doctorSpecialization" className="form-label">Doctor Specialization</label>
                <input type="text" id="doctorSpecialization" placeholder="Search by specialization" name="doctorSpecialization" className="form-control" onChange={(e) => setSpecializationSearch(e.target.value)}/>
            </form>

            <br />

            {doctorDetails.length > 0 && doctorDetails.map((doctor, idx) => (
                <PatientDoctorSearchResult userInfo={user_info} doctorDetails={doctorDetails[idx]} key={doctor.doctor_id}/>
            ))}
    
        </>
    )
}

export default PatientDoctorSearch;