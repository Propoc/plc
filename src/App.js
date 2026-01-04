import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { useAuth } from "react-oidc-context";




function App() {

  const auth = useAuth();

  useEffect(() => {
    if (
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !auth.error
    ) {
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


  return (
    <Dashboard accessToken={auth.user?.access_token} />
  );
}

export default App;