import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Card, ListGroup, Spinner, Alert, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Expenses() {
    const [expensesData, setExpensesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const yearRef = ref(storage, 'yearwisedata/');
                const result = await listAll(yearRef);
                const yearFolders = result.prefixes.map(prefix => prefix.name);

                setYears(yearFolders);

                const currentYear = new Date().getFullYear().toString();
                setSelectedYear(yearFolders.includes(currentYear) ? currentYear : (yearFolders[0] || '2022'));
            } catch (error) {
                setError('Error fetching years');
                console.error('Error fetching years:', error);
            }
        };
        fetchYears();
    }, []);

    useEffect(() => {
        const fetchExpensesData = async () => {
            if (!selectedYear) return;
            try {
                const expensesRef = ref(storage, `yearwisedata/${selectedYear}/expenses.json`);
                const url = await getDownloadURL(expensesRef);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                // Adjusting for different possible data structures
                setExpensesData(data.expenseData || data || []);
            } catch (error) {
                setError('Error fetching expenses data');
                console.error('Error fetching expenses data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpensesData();
    }, [selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setLoading(true);
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <h1>Expenses</h1>
            <Form.Group controlId="yearSelect" className="mb-4">
                <Form.Label>Select Year</Form.Label>
                <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <ListGroup>
                {expensesData.map((expense, index) => (
                    <ListGroup.Item key={index}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{expense.name}</Card.Title>
                                <Card.Text>Total Amount: {expense.totalAmount}</Card.Text>
                                <Card.Text>Advance: {expense.advance ? 'Yes' : 'No'}</Card.Text>
                                <Card.Text>Note: {expense.note || 'N/A'}</Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default Expenses;
