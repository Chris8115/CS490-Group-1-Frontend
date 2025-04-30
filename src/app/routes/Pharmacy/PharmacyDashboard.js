
import { useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import { useState } from "react";
import Divider from "../../../components/Divider";
import { useUser } from "../../UserContext";
import { useNavigate } from 'react-router-dom';

function PharmacyDashboard() {
    const navigate = useNavigate();

    useEffect(()=>{
        fetch('/api/pharmacy/login_check', {
            method: 'GET',
            credentials: 'include',
            redirect: 'manual', /* Needed for login_check */
        }).then(resp => {
            console.log(resp.status);
            if(resp.status != 200) {
                alert("You need to be logged in to view this page.");
                navigate('/pharmacy-log-in');
            }
        })
    }, [])
    
    

    return <>
        <h1>Dashboard</h1>
        <Divider/>
        <div style = {{ display: 'flex', flexDirection: "column" }} >
            <DashboardItem itemName="Patient Search" itemDescription="View patient's medical and prescription data." href="/pharmacy/patient-search" icon="doctor_icon" key="patient-search" />
            <DashboardItem itemName="Deliveries" itemDescription="Check status of all deliveries." href="/pharmacy/deliveries" icon="appointment_icon" key="deliveries" />   
            <DashboardItem itemName="Product Records" itemDescription="View details of products (inventory, users, prices, description)." href="/pharmacy/records" icon="graph_icon" key="records" />   
            <DashboardItem itemName="Add Product" itemDescription="Update inventory and records with new products." href="/pharmacy/add-product" icon="pill_icon" key="add-product" />   
        </div>
        
        <br/>
        

    </>
}

export default PharmacyDashboard;