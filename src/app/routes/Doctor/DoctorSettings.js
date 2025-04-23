import { useEffect, useState } from "react";
import '../../../css/doctor_settings.css';

function DoctorSettings() {
    const [user, setUser] = useState({});
    const [doctor, setDoctor] = useState({});
    const [bio, setBio] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));

        const getDoctorInfo = async () => {
            try {
                const doctorRes = await fetch(`/api/betteru//doctors?doctor_id=${user_info.user_id}`);
                const doctorData = await doctorRes.json();
                const doctorDetails = doctorData.doctors[0];
                setDoctor(doctorDetails);
                setBio(doctorDetails.profile);
                setSpecialization(doctorDetails.specialization);
            } catch (error) {
                console.error("Failed to fetch doctor data:", error);
            }

            try {
                const userRes = await fetch(`/api/betteru//users?user_id=${user_info.user_id}`);
                const userData = await userRes.json();
                setUser(userData.users[0]);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        getDoctorInfo();
    }, []);

    const handleSave = async () => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setEditing(false);

        try {
            await fetch(`/api/betteru/doctors/${user_info.user_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    profile: bio,
                    specialization: specialization
                }),
            });
        } catch (err) {
            console.error("Failed to save updates:", err);
        }

        setDoctor(prev => ({ ...prev, profile: bio, specialization }));
    };

    return (
        <div className="profile-container">
            <h2>Doctor Profile</h2>

            <div className="profile-section">
                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone Number:</strong> {user.phone_number}</p>
                <p><strong>Account Created:</strong> {user.created_at?.split(" ")[0]}</p>
            </div>

            <div className="editable-section">
                <h3>Public Profile</h3>
                {editing ? (
                    <div className='editable-details'>
                        <div>
                            <label>Bio:</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label>Specialization:</label>
                            <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                        </div>
                        <button className="profile-button" onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <div className='editable-details'>
                        <p><strong>Bio:</strong> {bio}</p>
                        <p><strong>Specialization:</strong> {specialization}</p>
                        <button className="profile-button" onClick={() => setEditing(true)}>Edit</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorSettings;
