import React from 'react'
import App from './App.tsx'
import './index.css'
import '@fontsource/inter';
import ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './il8n.ts';


// Render the App component to the root element
ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

