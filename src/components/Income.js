// src/components/Income.js
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function Income() {
    const [incomeData, setIncomeData] = useState(null);

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const incomeRef = ref(storage, '2022/income.json');
                const url = await getDownloadURL(incomeRef);
                const response = await fetch(url);
                const data = await response.json();
                setIncomeData(data);
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        fetchIncomeData();
    }, []);

    return (
        <div>
            <h1>Income</h1>
            {incomeData && incomeData.collection.map((entry, index) => (
                <div key={index}>
                    <p>Name: {entry.name}</p>
                    <p>Son of: {entry.sonof}</p>
                    <p>Amount: {entry.amount}</p>
                    <p>Phone: {entry.phone}</p>
                </div>
            ))}
        </div>
    );
}

export default Income;
