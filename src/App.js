import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Contacts from './components/Contacts';
import Pay from './components/Pay';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Home from './components/Home'; 
import AdminDashboard from './components/AdminDashboard';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
