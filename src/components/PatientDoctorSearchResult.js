
import { useEffect } from 'react';
import '../css/doctor-search.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StarRating from './StarRating';
import PatientDoctorSearchReview from './PatientDoctorSearchReview';

function PatientDoctorSearchResult(props) {
    const navigate = useNavigate();
    const patientUser = props.userInfo;
    const doctorDetails = props.doctorDetails;
    const [doctorReviews, setDoctorReviews] = useState([]);
    const [reviewsVisible, setReviewsVisible] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        // Get all reviews of doctor
        const getReviews = async () => {
            try {
                const response = await fetch(`/api/betteru/reviews?doctor_id=${doctorDetails.doctor_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })

                const data = await response.json();
                const reviews = data.reviews;
                setDoctorReviews(reviews);

                let ratingAverage = 0.0;
                for (let i = 0; i < reviews.length; i++) {
                    ratingAverage += reviews[i].rating;
                }
                ratingAverage /= reviews.length;
                setAverageRating(ratingAverage);
     
            } catch (e) {
                console.error(e);
            }
        }

        getReviews();

    }, [])

    const showReviews = () => {
        setReviewsVisible(!reviewsVisible);
    }

    const chooseDoctor = async () => {
        const patientId = patientUser.user_id;
        const doctorId = doctorDetails.doctor_id;
        console.log(patientId, doctorId);
        
        const payload = {
            doctor_id: doctorId,
            patient_id: patientId,
            status: "active",
        };

        const response = await fetch(`/api/betteru/doctor_patient_relationship`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(data);
        navigate(0);
    }

    return <>
    
    <div className="doctor-search-card">
            <img src={doctorDetails.picture} />
            <div className="doctor-search">
                <h3>Dr. {doctorDetails.last_name}</h3>
                <StarRating showRating={averageRating}/>
                <h4 style={{color: '#696969'}} >{doctorDetails.specialization}</h4>
                <p>{doctorDetails.profile}</p>
                <button className='btn btn-success mb-2' onClick={showReviews}>Show Reviews</button>
                {reviewsVisible && (
                    doctorReviews.map((review, index) => {
                        return <PatientDoctorSearchReview review={review} />
                    })
                )}

                <button className="btn btn-primary" onClick={chooseDoctor}>Choose Doctor</button>
            </div>

    </div>

    </>
}
export default PatientDoctorSearchResult;   