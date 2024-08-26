import React, { useState, useEffect } from 'react';
import { storage } from '../firebaseConfig';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function AdminEditPay() {
    const [payData, setPayData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayData = async () => {
            try {
                const payRef = ref(storage, 'pay/pay.json');
                const url = await getDownloadURL(payRef);
                const response = await fetch(url);
                const data = await response.json();
                setPayData(data);
            } catch (error) {
                setError('Error fetching pay data');
                console.error('Error fetching pay data:', error);
            }
        };
        fetchPayData();
    }, []);

    const handleSave = async () => {
        try {
            const payRef = ref(storage, 'pay/pay.json');
            await uploadString(payRef, JSON.stringify(payData), 'raw', { contentType: 'application/json' });
            alert('Pay data updated successfully!');
        } catch (error) {
            setError('Error updating pay data');
            console.error('Error updating pay data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayData({ ...payData, [name]: value });
    };

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1>Edit Pay Data</h1>
            {payData && (
                <Form>
                    <Form.Group controlId="formPay">
                        <Form.Label>Pay Data</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={JSON.stringify(payData, null, 2)}
                            onChange={(e) => setPayData(JSON.parse(e.target.value))}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Form>
            )}
        </Container>
    );
}

export default AdminEditPay;
