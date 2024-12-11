import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactKeycloakProvider } from '@react-keycloak/web';  // Para Keycloak
import keycloak from './keycloak';
import { BrowserRouter } from 'react-router-dom';  // Importa BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </ReactKeycloakProvider>
);

reportWebVitals();