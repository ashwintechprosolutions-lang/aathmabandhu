import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './store';
import { AlertProvider } from './components/Alert';
import { API_MODE } from './api/client';
import { resetMockDb } from './api/mockServer';
import './styles.css';

if (API_MODE !== 'live') {
  // Handy while testing: run `atmaResetDemoData()` in the browser console.
  window.atmaResetDemoData = () => {
    resetMockDb();
    console.info('[mock] demo data reset');
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
