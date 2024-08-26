// src/components/Pay.js
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Pay() {
    const [payData, setPayData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayData = async () => {
            try {
                const payRef = ref(storage, 'pay/pay.json');
                const url = await getDownloadURL(payRef);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setPayData(data);
            } catch (error) {
                setError('Failed to fetch pay data.');
            }
        };

        fetchPayData();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Payment Information</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {payData ? (
                <Card>
                    <Card.Body>
                        <Card.Title>Payment Details</Card.Title>

                        <Card.Subtitle className="mb-2 text-muted">Bank Transfer</Card.Subtitle>
                        <Card.Text>
                            <strong>Account Number:</strong> {payData.payment_details.bank_transfer.account_number}<br />
                            <strong>IFSC Code:</strong> {payData.payment_details.bank_transfer.ifsc_code}<br />
                            <strong>Bank Name:</strong> {payData.payment_details.bank_transfer.bank_name}<br />
                            <strong>Account Holder:</strong> {payData.payment_details.bank_transfer.account_holder}
                        </Card.Text>

                        <Card.Subtitle className="mb-2 text-muted">GPay</Card.Subtitle>
                        <Card.Text>
                            <strong>Phone Number:</strong> {payData.payment_details.gpay.phone_number}<br />
                            <strong>UPI ID:</strong> {payData.payment_details.gpay.upi_id}
                        </Card.Text>

                        <Card.Subtitle className="mb-2 text-muted">Contact</Card.Subtitle>
                        <Card.Text>
                            <strong>Mobile:</strong> {payData.contact.mobile}
                        </Card.Text>

                        <Card.Subtitle className="mb-2 text-muted">Note</Card.Subtitle>
                        <Card.Text>{payData.note}</Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                <Spinner animation="border" />
            )}
        </Container>
    );
}

export default Pay;
