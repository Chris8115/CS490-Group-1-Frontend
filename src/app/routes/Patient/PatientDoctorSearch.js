import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { useState } from "react";
import PatientDoctorSearchResult from "../../../components/PatientDoctorSearchResult";

function PatientDoctorSearch() {
    const { userInfo } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [doctorDetails, setDoctorDetails] = useState([]);

    // Debounce logic
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 100); 

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedTerm) {
            setDoctors([]);
            return;
        }

        const fetchDoctors = async () => {
            const response = await fetch(`/users?role=doctor&last_name=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            console.log(data.users);
            setDoctors(data.users);

            
            const doctorIds = data.users.map(doctor => doctor.user_id);

            const fetchDoctorDetails = async (doctorIds) => {
                try {
                    const detailsPromises = doctorIds.map(async (doctorId) => {
                        const detailsResponse = await fetch(`/doctors?doctor_id=${doctorId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include'
                        });

                        const detailsData = await detailsResponse.json();
                        setDoctorDetails(detailsData.doctors);
             
                    })
                } catch (e) {
                    console.error(e);
                }
            }

            if (doctorIds > 0) {
                await fetchDoctorDetails(doctorIds);
            }

        }

        fetchDoctors()

    }, [debouncedTerm])

    return (
        <>        
            <form >
                <label htmlFor="doctorName" className="form-label">Doctor Name</label>
                <input type="text" id="doctorName" placeholder="Search for doctors..." name="doctorName" className="form-control" onChange={(e) => setSearchTerm(e.target.value)}/>
            </form>

            <br />

            {doctorDetails.length > 0 && doctors.length > 0  && doctorDetails.map((doctor, idx) => (
                <PatientDoctorSearchResult doctorUser={doctors[idx]} doctorDetails={doctorDetails[idx]} key={doctor.user_id}/>
            ))}
    
        </>
    )
}

export default PatientDoctorSearch;