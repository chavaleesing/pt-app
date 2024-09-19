import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sompong from './sompong'; 
import Tbt from './tbt'; 

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Select an option:</h1>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/sompong">
            <button style={{ marginRight: '20px' }}>สมพงศ์</button>
          </Link>
          <Link to="/tbt">
            <button>เทพบัวทอง</button>
          </Link>
        </div>

        {/* Define the routes for navigating */}
        <Routes>
          <Route path="/sompong" element={<Sompong />} />
          <Route path="/tbt" element={<Tbt />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
