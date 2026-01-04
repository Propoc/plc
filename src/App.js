import React, { useEffect, useState , useRef} from "react";
import Dashboard from "./Dashboard";
import { useAuth } from "react-oidc-context";




function App() {

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
}

export default App;