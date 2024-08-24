import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Income from './components/Income';
import Contacts from './components/Contacts';
import Pay from './components/Pay';
import Expenses from './components/Expenses';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/income" element={<Income />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/pay" element={<Pay />} />
                <Route path="/expenses" element={<Expenses />} />
            </Routes>
        </Router>
    );
}

export default App;
