import { useEffect } from "react";
import { useUser } from "../app/UserContext";
import { useState } from "react";
import PharmacyDeliveryStatus from "./PharmacyDeliveryStatus";

function PharmacyDeliveries({status}) {
    const { userInfo } = useUser();
    const [orders, setOrders] = useState([]);


    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/pharmacy/orders?status=${status}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            const data = await response.json();
            setOrders(data.orders);
        } catch (e) {
            console.error(e);
        }
    }

    // ID Search
    useEffect(() => {
        if (!status) {status = '';}
        fetchOrders();

    }, [])

    return (
        <>         
        {orders.length > 0 && orders.map((order, idx) => (
            <PharmacyDeliveryStatus order={order} key={order.order_id}/>
        ))}
    
        </>
    )
}

export default PharmacyDeliveries;