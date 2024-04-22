import React from 'react'
import App from './App.tsx'
import './index.css'
import '@fontsource/inter';
import ReactDOM from 'react-dom';


import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';
import Home from './components/Home.tsx';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
