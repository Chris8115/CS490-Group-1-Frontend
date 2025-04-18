import { React, useState, useEffect } from 'react';
import BetterUNavbar from '../../../components/BetterUNavbar';
import Divider from '../../../components/Divider';
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../../css/patient-view.css';

function DoctorPatientView() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const patientsPerPage = 10;

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
      };
    
      const offset = currentPage * patientsPerPage;
      // const currentPatients = patients.slice(offset, offset + patientsPerPage);
      const pageCount = Math.ceil(patients.length / patientsPerPage);
      
      useEffect(() => {
          fetch('http://localhost:5000/doctor_patient_relationship')
            .then((res) => {
              if (!res.ok) {
                throw new Error('Failed to fetch forum posts');
              }
              return res.json();
            })
            .then((data) => {
              setPatients(data); // updated to store the array directly
              setLoading(false);
            })
            .catch((err) => {
              setError(err.message);
              setLoading(false);
            });
        }, []);

      console.log(patients);

      function displayPatients() {
        if (loading) return <p>Loading patients...</p>;
        if (error) return <p>Error: {error}</p>;
    
        return (
          <>
            <div className="patients-container">
              <div className='patient'>
                <a><p>Ryan Ramos</p></a>
              </div>
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
        <>
            <div className='patient-view-display'>
              <h1 style={{margin: '50px 100px'}}>View Patients</h1>
              <Divider />
              <div className='patient-list'>
                  {displayPatients()}
              </div>
            </div>
            
            
        </>
    )
}

export default DoctorPatientView;