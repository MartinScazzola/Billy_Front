import React from 'react'
import App from './App.tsx'
import './index.css'
import '@fontsource/inter';
import ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
