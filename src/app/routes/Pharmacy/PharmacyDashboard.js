
import { useEffect } from "react";
import DashboardItem from "../../../components/DashboardItem";
import axios from "axios";
import { useState } from "react";
import Divider from "../../../components/Divider";
import { useUser } from "../../UserContext";

function PharmacyDashboard() {
    

    useEffect(() => {


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