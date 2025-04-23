import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { useState } from "react";
import PharmacyDeliveryStatus from "../../../components/PharmacyDeliveryStatus";

function PharmacyDeliveries() {
    const { userInfo } = useUser();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/pharmacy/orders`, {
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
        fetchOrders();

    }, [])

    return (
        <>        
        <h1>Deliveries</h1>   
            {orders.length > 0 && orders.map((order, idx) => (
                <PharmacyDeliveryStatus order={order} key={order.order_id}/>
            ))}
    
        </>
    )
}

export default PharmacyDeliveries;