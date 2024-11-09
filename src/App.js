import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import { Attendance } from './pages/Attendance';
import View from './pages/View';
import BatchProcess from './pages/BatchProcess';
function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Attendance />} />
                    <Route path="/view" element={<View />} />
                    <Route path="/batch-process" element={<BatchProcess />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
