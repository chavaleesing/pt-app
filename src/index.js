import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Ensure this is imported
import App from './App'; // Assuming your App component is in the same directory

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
