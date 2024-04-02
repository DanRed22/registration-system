
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.css';

import { Attendance } from "./pages/Attendance";
function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Attendance />} />
      </Routes>
    </Router>
  </div>
  
  );
}

export default App;
