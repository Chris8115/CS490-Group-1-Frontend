import axios from "axios";
import { ResponsiveEmbed } from "react-bootstrap";

export async function getPatientDoctorId(user_id) {
    const response = await fetch(`/doctor_patient_relationship?patient_id=${user_id}&status=active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
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
        },
        withCredentials: true
    })
    return response.data.users[0];
}
