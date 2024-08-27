import React, { useState, useEffect } from 'react';
import { ref, uploadString, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const ALL_YEARS = Array.from({ length: 2050 - 1900 + 1 }, (_, i) => (1900 + i).toString());

function AdminDashboard() {
    const [error, setError] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [dataType, setDataType] = useState('income');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const yearRef = ref(storage, 'yearwisedata/');
                const result = await listAll(yearRef);
                const yearFolders = result.prefixes.map(prefix => prefix.name);

                setYears(yearFolders);

                const currentYear = new Date().getFullYear().toString();
                setSelectedYear(yearFolders.includes(currentYear) ? currentYear : '2022');
            } catch (error) {
                setError('Error fetching years');
            }
        };
        fetchYears();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedYear) return;
            try {
                const fileRef = ref(storage, `yearwisedata/${selectedYear}/${dataType}.json`);
                try {
                    const url = await getDownloadURL(fileRef);
                    const response = await fetch(url);
                    const data = await response.json();
                    if (dataType === 'income') {
                        setFormData(data.collection ? data.collection[0] : {});
                    } else if (dataType === 'expenses') {
                        setFormData(data.expenseData ? data.expenseData[0] : {});
                    }
                } catch (error) {
                    setFormData({});
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedYear, dataType]);

    const handleYearChange = async (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        if (!years.includes(year) && year !== 'newYear') {
            try {
                const newYearRef = ref(storage, `yearwisedata/${year}/`);
                await uploadString(newYearRef, '', 'raw', { contentType: 'application/json' });
                setYears([...years, year]);
            } catch (error) {
                setError('Error creating new year folder');
            }
        }
    };

    const handleDataTypeChange = (e) => {
        setDataType(e.target.value);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const fileRef = ref(storage, `yearwisedata/${selectedYear}/${dataType}.json`);
            let existingData = [];

            try {
                const url = await getDownloadURL(fileRef);
                const response = await fetch(url);
                existingData = await response.json();

                if (dataType === 'income') {
                    existingData = existingData.collection || [];
                    existingData.push(formData);
                } else if (dataType === 'expenses') {
                    existingData = existingData.expenseData || [];
                    existingData.push(formData);
                }
            } catch (error) {
                if (dataType === 'income') {
                    existingData = [formData];
                } else if (dataType === 'expenses') {
                    existingData = [formData];
                }
            }

            let newData;
            if (dataType === 'income') {
                newData = { collection: existingData };
            } else if (dataType === 'expenses') {
                newData = { expenseData: existingData };
            }

            await uploadString(fileRef, JSON.stringify(newData), 'raw', { contentType: 'application/json' });
            alert(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data added successfully!`);
        } catch (error) {
            setError(`Error adding ${dataType} data`);
        }
    };

    return (
        <Container>
            <h1>Admin Dashboard</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="yearSelect" className="mb-3">
                <Form.Label>Select Year</Form.Label>
                <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
                    {ALL_YEARS.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                    <option value="newYear">Add New Year</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="dataTypeSelect" className="mb-3">
                <Form.Label>Select Data Type</Form.Label>
                <Form.Control as="select" value={dataType} onChange={handleDataTypeChange}>
                    <option value="income">Income</option>
                    <option value="expenses">Expenses</option>
                </Form.Control>
            </Form.Group>
            {dataType === 'income' && (
                <>
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                        />
                    </Form.Group>
                    <Form.Group controlId="formSonOf" className="mb-3">
                        <Form.Label>Son of</Form.Label>
                        <Form.Control
                            type="text"
                            name="sonof"
                            value={formData.sonof || ''}
                            onChange={handleInputChange}
                            placeholder="Enter son of"
                        />
                    </Form.Group>
                    <Form.Group controlId="formAmount" className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleInputChange}
                            placeholder="Enter amount"
                        />
                    </Form.Group>
                    <Form.Group controlId="formMode" className="mb-3">
                        <Form.Label>Mode</Form.Label>
                        <Form.Control
                            type="text"
                            name="mode"
                            value={formData.mode || ''}
                            onChange={handleInputChange}
                            placeholder="Enter mode"
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone" className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Enter phone"
                        />
                    </Form.Group>
                </>
            )}
            {dataType === 'expenses' && (
                <>
                    <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                        />
                    </Form.Group>
                    <Form.Group controlId="formTotalAmount" className="mb-3">
                        <Form.Label>Total Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount || ''}
                            onChange={handleInputChange}
                            placeholder="Enter total amount"
                        />
                    </Form.Group>
                    <Form.Group controlId="formAdvance" className="mb-3">
                        <Form.Label>Advance</Form.Label>
                        <Form.Control
                            type="number"
                            name="advance"
                            value={formData.advance || ''}
                            onChange={handleInputChange}
                            placeholder="Enter advance"
                        />
                    </Form.Group>
                    <Form.Group controlId="formNote" className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            type="text"
                            name="note"
                            value={formData.note || ''}
                            onChange={handleInputChange}
                            placeholder="Enter note"
                        />
                    </Form.Group>
                </>
            )}
            <Button variant="primary" onClick={handleSave}>Add Data</Button>
        </Container>
    );
}

export default AdminDashboard;
