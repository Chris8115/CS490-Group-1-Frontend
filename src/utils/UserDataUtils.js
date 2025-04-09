import axios from "axios";
import { ResponsiveEmbed } from "react-bootstrap";

export async function getPatientDoctorId() {
    const response = await axios.get("/doctor_patient_relationship", {
        params: {
            "patient_id": 26,
            "status": "active"
        }
    })
    let id = response.data.doctor_patient_relationship[0].doctor_id;
    return id;
}

export async function getDoctorLastName(id) {
    const data = await getUserData(id);
    return data.last_name;
}

export async function getUserData(id) {
    const response = await axios.get("/users", {
        params: {
            "user_id": id
        }
    })
    return response.data.users[0];
}