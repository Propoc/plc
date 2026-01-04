import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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
      <App />
  </React.StrictMode>
);

reportWebVitals();

/*
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);





  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "132nnak5fjs7880focne3ac7ot";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://eu-central-1igfgickad.auth.eu-central-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };


  const redirectingRef = useRef(false);

  useEffect(() => {
    if (
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !auth.error &&
      !redirectingRef.current
    ) {
      redirectingRef.current = true;
      auth.signinRedirect();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.error]);


  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return <div>Redirecting to login…</div>;
  }


  if (auth.isAuthenticated) {
    return (
      <Dashboard accessToken={auth.user} />
    );
  }


*/