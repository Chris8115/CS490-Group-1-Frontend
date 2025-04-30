import { useEffect, useState } from "react";
import '../../../css/doctor_settings.css';

function DoctorSettings() {
    const [user, setUser] = useState({});
    const [doctor, setDoctor] = useState({});
    const [bio, setBio] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [location, setLocation] = useState(""); // <-- NEW
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingLocation, setEditingLocation] = useState(false);

    useEffect(() => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        console.log(user_info);

        const getDoctorInfo = async () => {
            try {
                const doctorRes = await fetch(`/api/betteru//doctors?doctor_id=${user_info.user_id}`);
                const doctorData = await doctorRes.json();
                const doctorDetails = doctorData.doctors[0];
                setDoctor(doctorDetails);
                setBio(doctorDetails.profile);
                setSpecialization(doctorDetails.specialization);
                setLocation(doctorDetails.office);
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

    const handleSaveProfile = async () => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setEditingProfile(false);

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
            console.error("Failed to save profile updates:", err);
        }

        setDoctor(prev => ({ ...prev, profile: bio, specialization }));
    };

    const handleSaveLocation = async () => {
        const user_info = JSON.parse(sessionStorage.getItem('user_info'));
        setEditingLocation(false);

        try {
            await fetch(`/api/betteru/doctors/${user_info.user_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    office: location
                }),
            });
        } catch (err) {
            console.error("Failed to save location updates:", err);
        }

        setDoctor(prev => ({ ...prev, location }));
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

            {/* Public Profile Section */}
            <div className="editable-section">
                <h3>Public Profile</h3>
                {editingProfile ? (
                    <div className='editable-details'>
                        <div>
                            <label>Bio:</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label>Specialization:</label>
                            <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                        </div>
                        <button className="profile-button" onClick={handleSaveProfile}>Save</button>
                    </div>
                ) : (
                    <div className='editable-details'>
                        <p><strong>Bio:</strong> {bio}</p>
                        <p><strong>Specialization:</strong> {specialization}</p>
                        <button className="profile-button" onClick={() => setEditingProfile(true)}>Edit</button>
                    </div>
                )}
            </div>

            {/* Location Section */}
            <div className="editable-section">
                <h3>Location</h3>
                {editingLocation ? (
                    <div className='editable-details'>
                        <div>
                            <label>Location/Meeting Instructions:</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <button className="profile-button" onClick={handleSaveLocation}>Save</button>
                    </div>
                ) : (
                    <div className='editable-details'>
                        <p><strong>Location/Meeting Instructions:</strong> {location}</p>
                        <button className="profile-button" onClick={() => setEditingLocation(true)}>Edit</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorSettings;
