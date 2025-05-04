import { useEffect, useState } from "react";
import axios from "axios";
import Divider from "../../../components/Divider";
import { getDoctorLastName, getUserData } from "../../../utils/UserDataUtils";
import StarRating from "../../../components/StarRating";
import Footer from "../../../components/Footer";
import BetterUNavbar from "../../../components/BetterUNavbar";
import { useUser } from "../../UserContext";
import { sub } from "date-fns";

function PatientReview() {
    const { userInfo } = useUser();
    // All previous doctors that the patient has had
    const [allDoctors, setAllDoctors] = useState([]);
    const [doctorData, setDoctorData] = useState([]);
    const [rating, setRating] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    useEffect(() => {
        const getDoctors = async () => {
            try {
                const response = await fetch(`/api/betteru/doctor_patient_relationship?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })

                const data = await response.json();

                let doctorRelationships = data.doctor_patient_relationship;
                let doctorIds = doctorRelationships.map(r => r.doctor_id);

                setAllDoctors(doctorIds);

                const doctorsInfo = await Promise.all(
                    doctorIds.map(id => getUserData(id))
                );
                setDoctorData(doctorsInfo);
                onSelectDoctor({ target: { value: doctorsInfo[0].user_id } });

    
            } catch (e) {
                console.log(e);
            }   
        }

        getDoctors();
    }, [userInfo]);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(newRating);
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating == null) {
            alert("Must provide rating.");
        } else {
            try {
                const response = await fetch(`/api/betteru/reviews?doctor_id=${selectedDoctor}&patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })

                const data = await response.json();

                const reviewExists = data.reviews.length > 0;
                if (reviewExists) {
                    alert("Review for this doctor already submitted.");
                    return;
                }

                const args = {
                    patient_id: userInfo.user_id,
                    doctor_id: selectedDoctor,
                    rating: rating,
                    review_text: reviewText
                }

                const submit = await fetch(`/api/betteru/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(args)
                });

                const submitData = await submit.json();
                
            if(submit.status == 201 || submit.status == 200){
                setReviewSubmitted(true);
            }  

            } catch (e) {
                console.log(e);
            }
        }
    }

    const onSelectDoctor = (e) => {
        const selectedId = e.target.value;
        setSelectedDoctor(selectedId);
    }

    const onChangeReviewText = (e) => {
        const newReviewText = e.target.value;
        setReviewText(newReviewText);
    }

    if (reviewSubmitted) {
        return <h1>Review successfully submitted.</h1>
    }

    return <>

    <h1>Write Review</h1>

    <form onSubmit={handleSubmitReview}>
        <label>Doctor</label>
        <select className="form-select" aria-label="Doctor Selection" onChange={onSelectDoctor}>
            {doctorData.map((doctor, index) => (
                <option value={doctor.user_id} key={index}>Dr. {doctor.last_name}</option>
            ))}
        </select>

        <br/>

        <label>Rating</label>
        <StarRating onRatingChange={handleRatingChange}/>

        <div className="form-group">
            <label htmlFor="reviewText">Review</label>
            <textarea className="form-control" id="reviewText" rows="3" required onChange={onChangeReviewText} />
        </div>

        <br/>
        <button type="submit" className="btn btn-primary">Submit Review</button>
    </form>

    
    </>
}

export default PatientReview;