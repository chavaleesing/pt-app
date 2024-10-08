import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Sompong from './sompong'; 
import Tbt from './tbt'; 
import CircularProgress from '@mui/material/CircularProgress'; 
import Button from '@mui/material/Button'; 
import Box from '@mui/material/Box'; 

function App() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate(); 

  const goToPage = async (pageName) => {
    setLoading(true);
    setResponseMessage(''); 

    try {
      const response = await fetch('https://pt-api-jrep.onrender.com/healthcheck');
      if (response.ok) {
        setResponseMessage('เริ่มใช้งานได้');
        if(pageName){
          navigate('/' + pageName);
        }
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
    <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
      <h1>เลือกบริษัท</h1>
      
      {/* Navigation Buttons */}
      <Box sx={{ marginBottom: '20px' }}>
        <Button 
          onClick={() => goToPage('sompong')} 
          disabled={loading} 
          variant="contained" 
          color="success"
          size="large" 
          sx={{ marginRight: '20px', padding: '10px 30px', fontSize: '20px', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'สมพงศ์'}
        </Button>
        <Button 
          onClick={() => goToPage('tbt')}
          disabled={loading} 
          variant="contained" 
          color="success"
          size="large" 
          sx={{ marginRight: '20px', padding: '10px 30px', fontSize: '20px', borderRadius: '6px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'เทพบัวทอง'}
        </Button>
      </Box>

      {/* Health Check Button */}
      <Box sx={{ marginBottom: '20px' }}>
        <Button 
        onClick={() => goToPage()} 
          disabled={loading} 
          variant="outlined" 
          color="error"
          size="large"
          sx={{ padding: '5px 15px', fontSize: '12px', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Restart ระบบ'}
        </Button>
      </Box>
      
      {/* Response Message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Define the routes for navigating */}
      <Routes>
        <Route path="/sompong" element={<Sompong />} />
        <Route path="/tbt" element={<Tbt />} />
      </Routes>
    </Box>
  );
}

export default App;
