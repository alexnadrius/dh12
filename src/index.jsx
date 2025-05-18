import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/style.css';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
