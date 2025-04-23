import { React, useState, useEffect } from 'react';
import BetterUNavbar from '../../../components/BetterUNavbar';
import Divider from '../../../components/Divider';
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../../css/patient-view.css';

function DoctorPatientView() {
    const [patients, setPatients] = useState([]);
    const [patientNames, setPatientNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const patientsPerPage = 10;
    const navigate = useNavigate();

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * patientsPerPage;
    const pageCount = Math.ceil(patients.length / patientsPerPage);

    useEffect(() => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        
        fetch(`http://localhost:5000/doctor_patient_relationship?doctor_id=${user_info.user_id}&status=accepted`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch doctor-patient relationships');
                }
                return res.json();
            })
            .then(async (data) => {
                setPatients(data.doctor_patient_relationship);
                await fetchPatientNames(data.doctor_patient_relationship);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const fetchPatientNames = async (appointments) => {
        const names = {};

        await Promise.all(
            appointments.map(async (appt) => {
                const patientId = appt.patient_id;
                if (patientId && !names[patientId]) {
                    try {
                        const response = await fetch(`/users?user_id=${patientId}`);
                        if (!response.ok) throw new Error("Failed to fetch patient");
                        const data = await response.json();
                        names[patientId] = `${data.users[0].first_name} ${data.users[0].last_name}`;
                    } catch (error) {
                        console.error("Error fetching patient info:", error);
                        names[patientId] = "Unknown Patient";
                    }
                }
            })
        );

        setPatientNames(names);
    };

    function displayPatients() {
        if (loading) return <p>Loading patients...</p>;
        if (error) return <p>Error: {error}</p>;

        const currentPatients = patients.slice(offset, offset + patientsPerPage);

        return (
            <>
                <div className="patients-container">
                    {currentPatients.map((p) => (
                        <div className='patient' key={p.patient_id}>
                            <a onClick={() => navigate(`/patient/${p.patient_id}`)}>
                                <p>{patientNames[p.patient_id] || 'Loading...'}</p>
                            </a>
                        </div>
                    ))}
                </div>

                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={1}
                    pageCount={pageCount}
                    previousLabel="< Prev"
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                />
            </>
        );
    }

    return (
        <div className='patient-view-display'>
            <h1 style={{ margin: '50px 100px' }}>View Patients</h1>
            <Divider />
            <div className='patient-list'>
                {displayPatients()}
            </div>
        </div>
    );
}

export default DoctorPatientView;
