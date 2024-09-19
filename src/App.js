import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Sompong from './sompong'; // Ensure the file name and import match
import Tbt from './tbt'; // Ensure the file name and import match
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading symbol

function App() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const checkHealth = async () => {
    setLoading(true);
    setResponseMessage(''); // Clear any previous messages

    try {
      const response = await fetch('https://pt-api-jrep.onrender.com/healthcheck');
      if (response.ok) {
        setResponseMessage('เริ่มใช้งานได้');
      } else {
        setResponseMessage('API returned an error.');
      }
    } catch (error) {
      setResponseMessage('Error connecting to API.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Health Check Button */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={checkHealth} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Check API Health'}
          </button>
        </div>
        {responseMessage && <p>{responseMessage}</p>}

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
