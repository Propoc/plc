import React, { useEffect, useState , useRef, useMemo} from "react";
import Dashboard from "./Dashboard";
import Project from "./Project";
import { useAuth } from "react-oidc-context";

  const projects = [
    {
        name: "perlus-nike-1",
        projectNo: "MEA-2026-01-010",
        deviceNo: "AERO-2600038",
        ahuNo: "AHU-1",
        topic : "tmsig-1/1"
    },
    {
        name: "perlus-nike-2",
        projectNo: "MEA-2026-01-011",
        deviceNo: "AERO-2600039",
        ahuNo: "AHU-2",
        topic : "tmsig-1/2"
    },
    {
        name: "perlus-nike-3",
        projectNo: "MEA-2026-01-012",
        deviceNo: "AERO-2600040",
        ahuNo: "AHU-3",
        topic : "tmsig-1/3"

    },
    {
        name: "xyz-ford-1",
        projectNo: "MEA-2026-02-001",
        deviceNo: "AERO-2700001",
        ahuNo: "AHU-1",
        topic : "tmsig-1/4"
    },
    {
        name: "lmn-bmw-1",
        projectNo: "MEA-2026-03-001",
        deviceNo: "AERO-2800001",
        ahuNo: "AHU-1",
        topic : "tmsig-1/5"
    }

  ];



function App() {

  const auth = useAuth();
  const [page, setPage] = useState("project");
  const [selectedProject, setSelectedProject] = useState(null);

  const signOutRedirect = () => {
      const clientId = "132nnak5fjs7880focne3ac7ot";
      const logoutUri = "https://www.akscon.com";
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

  const visibleProjects = useMemo(() => {
  // If not logged in, return an empty list immediately
  if (!auth.isAuthenticated || !auth.user?.profile) return [];

  const profile = auth.user.profile;
  const userName = profile["cognito:username"] || profile["preferred_username"];
  
  console.log("Memo calculating projects for:", userName);

  return userName === "nemli"
    ? projects
    : projects.filter(p => p.name.startsWith(userName));

  }, [auth.isAuthenticated, auth.user, projects]);

  const userName = useMemo(() => {
    return auth.user?.profile?.["cognito:username"];
  }, [auth.user]);


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
      <>
        {page === "project" && <Project setPage={setPage} user={userName} visibleProjects = {visibleProjects} setSelectedProject={setSelectedProject} onLogout={signOutRedirect}/>}
        {page === "dashboard" && <Dashboard  setPage={setPage} project={selectedProject} user={userName}/>}
      </>
    );
  }

}

export default App;