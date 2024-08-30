import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';  // Ensure App.js contains no other Router
import { CssBaseline } from '@mui/material';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>
    <App />
  </Router>,
  </React.StrictMode>,
  document.getElementById('root')
);
