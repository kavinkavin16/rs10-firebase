import React from 'react';
import { Container, Nav, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout functionality
        navigate('/');
    };

    return (
        <Container>
            <h1>Admin Panel</h1>
            <Nav className="flex-column">
                <NavLink href="#" onClick={() => navigate('/admin-dashboard')}>Dashboard</NavLink>
                <NavLink href="#" onClick={() => navigate('/admin-panel')}>Manage Data</NavLink>
            </Nav>
            <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
        </Container>
    );
}

export default AdminPanel;
