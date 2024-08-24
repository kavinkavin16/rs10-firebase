// src/components/Expenses.js
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function Expenses() {
    const [expensesData, setExpensesData] = useState(null);

    useEffect(() => {
        const fetchExpensesData = async () => {
            try {
                const expensesRef = ref(storage, '2022/expenses.json');
                const url = await getDownloadURL(expensesRef);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setExpensesData(data.expenseData);
            } catch (error) {
                console.error('Error fetching expenses data:', error);
            }
        };

        fetchExpensesData();
    }, []);

    return (
        <div>
            <h1>Expenses</h1>
            {expensesData && expensesData.map((expense, index) => (
                <div key={index}>
                    <p>Name: {expense.name}</p>
                    <p>Total Amount: {expense.totalAmount}</p>
                    <p>Advance: {expense.advance}</p>
                    <p>Note: {expense.note}</p>
                </div>
            ))}
        </div>
    );
}

export default Expenses;
