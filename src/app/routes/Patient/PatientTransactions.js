import { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import PatientTransactionEntry from "../../../components/PatientTransactionEntry";

function PatientTransactions() {
    const { userInfo } = useUser();
    // Only stores accepted/awaiting transactions as that's all the patient sees
    const [patientTransactions, setPatientTransactions] = useState([]);

    useEffect(() => {
        if (!userInfo?.user_id) return;

        const getTransactions = async () => {
            try {
                const response = await fetch(`/api/betteru/transactions?patient_id=${userInfo.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const data = await response.json();

                const transactions = [];
                for (let i = 0; i < data.transactions.length; i++) {
                    transactions.push(data.transactions[i]);
                }

                console.log(data);
                console.log(transactions);

                setPatientTransactions(transactions);

            } catch (e) {
                console.error(e);
            }
        }

        getTransactions();



    }, [userInfo])

    return (
        <>
        
        <h1>Transactions</h1>

        <ul>
            {patientTransactions.map((transaction, idx) => (
                <PatientTransactionEntry transaction={transaction} key={transaction.transaction_id} />
            ))}
        </ul>
        {(patientTransactions.length == 0) ? <p>No transactions on record.</p> : <></>}
        
        </>
    )

}

export default PatientTransactions;