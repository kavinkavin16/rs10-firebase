// src/components/Contacts.js
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage'; // Import these from Firebase
import { storage } from '../firebaseConfig';

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Contacts</h1>
            {contactsData && Object.entries(contactsData).map(([name, phone]) => (
                <div key={name}>
                    <p>{name}: {phone}</p>
                </div>
            ))}
        </div>
    );
}

export default Contacts;
