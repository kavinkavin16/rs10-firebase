import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import { ref, uploadString, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function AdminPanel() {
    const [selectedYear, setSelectedYear] = useState('2022');
    const [incomeData, setIncomeData] = useState([]);
    const [expensesData, setExpensesData] = useState([]);
    const [payData, setPayData] = useState('');
    const [contactsData, setContactsData] = useState('');
    const [years, setYears] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [modalType, setModalType] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const yearRef = ref(storage, 'yearwisedata/');
                const result = await listAll(yearRef);
                const yearFolders = result.prefixes.map(prefix => prefix.name);
                setYears(yearFolders);
                setSelectedYear(yearFolders.includes('2022') ? '2022' : (yearFolders[0] || ''));
            } catch (error) {
                setError('Error fetching years');
                console.error('Error fetching years:', error);
            }
        };
        fetchYears();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch income data
                const incomeRef = ref(storage, `yearwisedata/${selectedYear}/income.json`);
                const incomeUrl = await getDownloadURL(incomeRef);
                const incomeResponse = await fetch(incomeUrl);
                const incomeJson = await incomeResponse.json();
                setIncomeData(incomeJson.collection || []);

                // Fetch expenses data
                const expensesRef = ref(storage, `yearwisedata/${selectedYear}/expenses.json`);
                const expensesUrl = await getDownloadURL(expensesRef);
                const expensesResponse = await fetch(expensesUrl);
                const expensesJson = await expensesResponse.json();
                setExpensesData(expensesJson.expenseData || []);

                // Fetch pay data
                const payRef = ref(storage, 'pay/pay.json');
                const payUrl = await getDownloadURL(payRef);
                const payResponse = await fetch(payUrl);
                const payJson = await payResponse.json();
                setPayData(JSON.stringify(payJson, null, 2));

                // Fetch contacts data
                const contactsRef = ref(storage, 'contacts/contacts.json');
                const contactsUrl = await getDownloadURL(contactsRef);
                const contactsResponse = await fetch(contactsUrl);
                const contactsJson = await contactsResponse.json();
                setContactsData(JSON.stringify(contactsJson, null, 2));
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedYear]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleSave = async (dataType, data) => {
        try {
            const fileRef = ref(storage, `${dataType}/${dataType}.json`);
            await uploadString(fileRef, data, 'raw', { contentType: 'application/json' });
            alert(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data saved successfully!`);
        } catch (error) {
            setError(`Error saving ${dataType} data`);
        }
    };

    const handleSaveData = async (type, data) => {
        const jsonData = JSON.stringify(data, null, 2);
        try {
            const fileRef = ref(storage, `yearwisedata/${selectedYear}/${type}.json`);
            await uploadString(fileRef, jsonData, 'raw', { contentType: 'application/json' });
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} data saved successfully!`);
        } catch (error) {
            setError(`Error saving ${type} data`);
        }
    };

    const handleEdit = (type, index, field, value) => {
        const newData = type === 'income' ? [...incomeData] : [...expensesData];
        newData[index][field] = value;
        type === 'income' ? setIncomeData(newData) : setExpensesData(newData);
    };

    const handleDelete = (type, index) => {
        const newData = type === 'income' ? [...incomeData] : [...expensesData];
        newData.splice(index, 1);
        type === 'income' ? setIncomeData(newData) : setExpensesData(newData);
    };

    const openModal = (type, index) => {
        const data = type === 'income' ? incomeData[index] : expensesData[index];
        setModalData(data);
        setModalType(type);
        setShowModal(true);
    };

    const handleModalSave = async () => {
        if (modalType === 'income') {
            const updatedIncome = [...incomeData];
            const index = updatedIncome.findIndex(item => item.id === modalData.id);
            updatedIncome[index] = modalData;
            await handleSaveData('income', updatedIncome);
            setIncomeData(updatedIncome);
        } else if (modalType === 'expenses') {
            const updatedExpenses = [...expensesData];
            const index = updatedExpenses.findIndex(item => item.id === modalData.id);
            updatedExpenses[index] = modalData;
            await handleSaveData('expenses', updatedExpenses);
            setExpensesData(updatedExpenses);
        }
        setShowModal(false);
    };

    return (
        <Container>
            <h1>Admin Panel</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="yearSelect" className="mb-3">
                <Form.Label>Select Year</Form.Label>
                <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
                    {years.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <h2>Income Data</h2>
            {incomeData.map((item, index) => (
                <Row key={index} className="mb-2">
                    <Col>
                        <Form.Control
                            type="text"
                            value={item.name || ''}
                            onChange={(e) => handleEdit('income', index, 'name', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            value={item.sonof || ''}
                            onChange={(e) => handleEdit('income', index, 'sonof', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            value={item.amount || ''}
                            onChange={(e) => handleEdit('income', index, 'amount', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            value={item.mode || ''}
                            onChange={(e) => handleEdit('income', index, 'mode', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            value={item.status || ''}
                            onChange={(e) => handleEdit('income', index, 'status', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={() => handleDelete('income', index)}>Delete</Button>
                        <Button onClick={() => openModal('income', index)}>Edit</Button>
                    </Col>
                </Row>
            ))}
            <Button onClick={() => handleSaveData('income', incomeData)}>Save Income Data</Button>

            <h2>Expenses Data</h2>
            {expensesData.map((item, index) => (
                <Row key={index} className="mb-2">
                    <Col>
                        <Form.Control
                            type="text"
                            value={item.name || ''}
                            onChange={(e) => handleEdit('expenses', index, 'name', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="number"
                            value={item.totalAmount || ''}
                            onChange={(e) => handleEdit('expenses', index, 'totalAmount', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            type="checkbox"
                            checked={item.advance || false}
                            onChange={(e) => handleEdit('expenses', index, 'advance', e.target.checked)}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            value={item.note || ''}
                            onChange={(e) => handleEdit('expenses', index, 'note', e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button variant="danger" onClick={() => handleDelete('expenses', index)}>Delete</Button>
                        <Button onClick={() => openModal('expenses', index)}>Edit</Button>
                    </Col>
                </Row>
            ))}
            <Button onClick={() => handleSaveData('expenses', expensesData)}>Save Expenses Data</Button>

            <h2>Pay Data</h2>
            <Form.Control
                as="textarea"
                rows={10}
                value={payData}
                onChange={(e) => setPayData(e.target.value)}
            />
            <Button onClick={() => handleSave('pay', payData)}>Save Pay Data</Button>

            <h2>Contacts Data</h2>
            <Form.Control
                as="textarea"
                rows={10}
                value={contactsData}
                onChange={(e) => setContactsData(e.target.value)}
            />
            <Button onClick={() => handleSave('contacts', contactsData)}>Save Contacts Data</Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'income' ? (
                        <Form>
                            <Form.Group controlId="modalName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={modalData.name || ''}
                                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalSonof">
                                <Form.Label>Son of</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={modalData.sonof || ''}
                                    onChange={(e) => setModalData({ ...modalData, sonof: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={modalData.amount || ''}
                                    onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalMode">
                                <Form.Label>Mode</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={modalData.mode || ''}
                                    onChange={(e) => setModalData({ ...modalData, mode: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={modalData.status || ''}
                                    onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    ) : (
                        <Form>
                            <Form.Group controlId="modalName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={modalData.name || ''}
                                    onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTotalAmount">
                                <Form.Label>Total Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={modalData.totalAmount || ''}
                                    onChange={(e) => setModalData({ ...modalData, totalAmount: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalAdvance">
                                <Form.Check
                                    type="checkbox"
                                    checked={modalData.advance || false}
                                    onChange={(e) => setModalData({ ...modalData, advance: e.target.checked })}
                                />
                                <Form.Label>Advance</Form.Label>
                            </Form.Group>
                            <Form.Group controlId="modalNote">
                                <Form.Label>Note</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={modalData.note || ''}
                                    onChange={(e) => setModalData({ ...modalData, note: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleModalSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminPanel;
