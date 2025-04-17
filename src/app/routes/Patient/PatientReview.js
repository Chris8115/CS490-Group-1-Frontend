import { useEffect, useState } from "react";
import axios from "axios";
import Divider from "../../../components/Divider";
import { getDoctorLastName, getUserData } from "../../../utils/UserDataUtils";
import StarRating from "../../../components/StarRating";
import Footer from "../../../components/Footer";
import BetterUNavbar from "../../../components/BetterUNavbar";

function PatientReview() {
    // All previous doctors that the patient has had
    const [allDoctors, setAllDoctors] = useState([]);
    const [doctorData, setDoctorData] = useState([]);
    const [rating, setRating] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        const getDoctors = async () => {
            try {
                const response = await axios.get("/doctor_patient_relationship", {
                params: {
                    "patient_id": 26
                }
                })
    
                let doctorRelationships = response.data.doctor_patient_relationship;
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
    }, []);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(newRating);
    }

    const handleSubmitReview = (e) => {
        if (rating == null) {
            e.preventDefault();
            alert("Must provide rating.");
        } else {
            try {
                axios.post("/reviews", {
                    "patient_id": 26,
                    "doctor_id": selectedDoctor,
                    "rating": rating,
                    "review_text": reviewText
                })
                alert("Review submitted.");
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

    return <>

    <BetterUNavbar />

    <div className="patient_pages">

    <h1>Write Review</h1>
    <Divider/>

    <div className="dashboard-features">
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

    </div>
    

    </div>
    <Divider />
    <Footer />
    </>
}

export default PatientReview;