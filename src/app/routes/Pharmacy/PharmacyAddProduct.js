import { useEffect } from "react";
import { useUser } from "../../UserContext";
import { useState } from "react";

function PharmacyAddProduct() {
    const { userInfo } = useUser();
    const [productAdded, setProductAdded] = useState(false);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");

    useEffect(() => {

    }, [])

    const addProduct = (e) => {
        e.preventDefault();

        const addProductValidation = async () => {
            const response = await fetch(`/api/pharmacy/medications?name=${productName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();
            if (data.medications.length > 0) {
                alert("Product name already exists.");
                return;
            }

            const payload = {
                name: productName,
                description: productDescription
            };

            const newMedicationResponse = await fetch(`/api/pharmacy/medications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const medResponseData = await newMedicationResponse.json();
            console.log(medResponseData);
            setProductAdded(true);
            
        }

        addProductValidation();
    }

    if (productAdded) {
        return (
            <>
                <h1>Product Successfully Added</h1>
                <a className="btn btn-success" href='/pharmacy/dashboard'>Return to Dashboard</a> 
                <b> </b>
                <a className="btn btn-success" href='/pharmacy/add-product'>Add New Product</a>
            </>
        ) 
    }

    return (
        <>     
        <h1>Add New Product</h1>   
            <form onSubmit={addProduct}>

                <label htmlFor="productName" className="form-label">Product Name</label>
                <input className='form-input' id="productName" placeholder="Product Name..." required name="productName" onChange={(e) => setProductName(e.target.value)}/>
                
                <label htmlFor="productDescription" className="form-label">Product Description</label>
                <input className='form-input' id="productDescription" placeholder="Product Description..." required name="productDescription" onChange={(e) => setProductDescription(e.target.value)}/>
                
                <button type='submit' className="login-btn" href=''>Add Product</button>

            </form>

    
        </>
    )
}

export default PharmacyAddProduct;