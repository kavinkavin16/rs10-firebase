import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function Pay() {
    const [payData, setPayData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayData = async () => {
            try {
                const payRef = ref(storage, 'pay/pay.json');
                const url = await getDownloadURL(payRef);
                console.log('Download URL:', url); // Log the URL
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                console.log('Fetched data:', data); // Log the data
                setPayData(data);
            } catch (error) {
                console.error('Error fetching pay data:', error);
                setError('Failed to fetch pay data.');
            }
        };

        fetchPayData();
    }, []);

    return (
        <div>
            <h1>Pay</h1>
            {error && <p>{error}</p>}
            {payData ? (
                <div>
                    <h2>Bank Transfer</h2>
                    <p>Account Number: {payData.payment_details.bank_transfer.account_number}</p>
                    <p>IFSC Code: {payData.payment_details.bank_transfer.ifsc_code}</p>
                    <p>Bank Name: {payData.payment_details.bank_transfer.bank_name}</p>
                    <p>Account Holder: {payData.payment_details.bank_transfer.account_holder}</p>

                    <h2>GPay</h2>
                    <p>Phone Number: {payData.payment_details.gpay.phone_number}</p>
                    <p>UPI ID: {payData.payment_details.gpay.upi_id}</p>

                    <h2>Contact</h2>
                    <p>Mobile: {payData.contact.mobile}</p>

                    <h2>Note</h2>
                    <p>{payData.note}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Pay;
