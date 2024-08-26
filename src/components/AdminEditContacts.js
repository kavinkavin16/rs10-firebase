import React, { useState, useEffect } from 'react';
import { storage } from '../firebaseConfig';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function AdminEditContacts() {
    const [contactsData, setContactsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactsData = async () => {
            try {
                const contactsRef = ref(storage, 'contacts/contacts.json');
                const url = await getDownloadURL(contactsRef);
                const response = await fetch(url);
                const data = await response.json();
                setContactsData(data);
            } catch (error) {
                setError('Error fetching contacts data');
                console.error('Error fetching contacts data:', error);
            }
        };
        fetchContactsData();
    }, []);

    const handleSave = async () => {
        try {
            const contactsRef = ref(storage, 'contacts/contacts.json');
            await uploadString(contactsRef, JSON.stringify(contactsData), 'raw', { contentType: 'application/json' });
            alert('Contacts data updated successfully!');
        } catch (error) {
            setError('Error updating contacts data');
            console.error('Error updating contacts data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactsData({ ...contactsData, [name]: value });
    };

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container>
            <h1>Edit Contacts Data</h1>
            {contactsData && (
                <Form>
                    <Form.Group controlId="formContacts">
                        <Form.Label>Contacts Data</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={JSON.stringify(contactsData, null, 2)}
                            onChange={(e) => setContactsData(JSON.parse(e.target.value))}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Form>
            )}
        </Container>
    );
}

export default AdminEditContacts;
