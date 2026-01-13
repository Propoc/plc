import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Test from './Test';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_igFgiCkad",
  client_id: "132nnak5fjs7880focne3ac7ot",
  redirect_uri: "https://www.akscon.com",       /// entering without www. is donzo , cloudflare needs to be configured there
  response_type: "code",
  scope: "openid email phone",

  
  loadUserInfo: true,
  automaticSilentRenew: true,
};

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

/*
root.render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>
);
*/

reportWebVitals();
