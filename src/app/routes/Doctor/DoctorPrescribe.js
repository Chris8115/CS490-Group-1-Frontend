import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import '../../../css/doctor_prescribe.css';

function DoctorPrescribe() {
  const { patient_id } = useParams();
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch(`/medications?page=${currentPage + 1}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setMedications(data.medications || []);
        setTotalPages(data.total_pages || 1);
      });
  }, [currentPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handlePrescribe = async () => {
    const doctor_id = JSON.parse(sessionStorage.getItem("user_info"))?.user_id;

    const body = {
      doctor_id,
      patient_id: parseInt(patient_id),
      pharmacist_id: 1, // Change as needed
      medication_id: selectedMedication.medication_id,
      quantity: parseInt(quantity),
      instructions
    };

    const res = await fetch('/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert("Prescription submitted successfully!");
      setShowModal(false);
    } else {
      alert("Failed to prescribe.");
    }
  };

  return (
    <div className="prescribe-wrapper">
      <div className="container mt-4">
        <h2>Prescribe Medication</h2>
        <ul className="list-group">
          {medications.map(med => (
            <li 
              key={med.medication_id} 
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => {
                setSelectedMedication(med);
                setShowModal(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              {med.name}
            </li>
          ))}
        </ul>

        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={totalPages}
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

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Prescribe: {selectedMedication?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Description:</strong> {selectedMedication?.description}</p>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                min={1} 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Instructions</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={instructions} 
                onChange={(e) => setInstructions(e.target.value)} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handlePrescribe}>Prescribe</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default DoctorPrescribe;
