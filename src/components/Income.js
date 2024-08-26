import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Card, ListGroup, Spinner, Alert, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Income() {
    const [incomeData, setIncomeData] = useState(null);
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

                // List all years including those not in Firebase Storage
                setYears(yearFolders);

                // Set default year to the current year if available
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
        const fetchIncomeData = async () => {
            if (!selectedYear) return;
            try {
                const incomeRef = ref(storage, `yearwisedata/${selectedYear}/income.json`);
                const url = await getDownloadURL(incomeRef);
                const response = await fetch(url);
                const data = await response.json();
                setIncomeData(data);
            } catch (error) {
                setError('Error fetching income data');
                console.error('Error fetching income data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIncomeData();
    }, [selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setLoading(true); // Set loading true when year changes
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <h1>Income Records</h1>
            <Form.Group controlId="yearSelect" className="mb-4">
                <Form.Label>Select Year</Form.Label>
                <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <ListGroup>
                {incomeData && incomeData.collection.map((entry, index) => (
                    <ListGroup.Item key={index} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>Name: {entry.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Son of: {entry.sonof}</Card.Subtitle>
                                <Card.Text>Amount: {entry.amount}</Card.Text>
                                <Card.Text>Phone: {entry.phone}</Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}

export default Income;
