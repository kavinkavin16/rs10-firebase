// src/components/Contacts.js
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Container, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Contacts() {
    const [contactsData, setContactsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactsData = async () => {
            try {
                const contactsRef = ref(storage, 'contacts/contacts.json');
                const url = await getDownloadURL(contactsRef);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setContactsData(data.contacts);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContactsData();
    }, []);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Contacts</h1>
            {contactsData && (
                <Card>
                    <Card.Body>
                        <ListGroup>
                            {Object.entries(contactsData).map(([name, phone]) => (
                                <ListGroup.Item key={name}>
                                    <strong>{name}:</strong> {phone}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default Contacts;
