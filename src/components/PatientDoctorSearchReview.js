import StarRating from "./StarRating";

function PatientDoctorSearchResult({ review }) {
    return <div className="p-3 mt-1 mb-1 bg-light border rounded">
        
        <div style={{display: "flex", alignItems: "center" }} >
            <StarRating showRating={review.rating}/>
            
            <h4 style={{color: '#696969', marginBottom: -4, marginLeft: 10}}>{review.created_at}</h4>
        </div>
        <p>{review.review_text}</p>
    </div>
}

export default PatientDoctorSearchResult;