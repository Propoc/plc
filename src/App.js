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
    topic: "tmsig-1/1",
    owner: "perlus"
  },
  {
    name: "perlus-nike-2",
    projectNo: "MEA-2026-01-010",
    deviceNo: "AERO-2600038",
    ahuNo: "AHU-2",
    topic: "tmsig-1/2",
    owner: "perlus"
  },
  {
    name: "Ser Mühendislik / world-medicine",
    projectNo: "MEA-2026-01-011",
    deviceNo: "AERO-2600039",
    ahuNo: "AHU-2",
    topic: "tmsig-1/1",
    owner: "ser"
  },
  {
    name: "Aero-system kalem vakfı",
    projectNo: "MEA-2026-01-012",
    deviceNo: "AERO-2600040",
    ahuNo: "AHU-3",
    topic: "tmsig-1/1",
    owner: "aero"
  },
  {
    name: "Aero-system kuzey ırak",
    projectNo: "MEA-2026-02-001",
    deviceNo: "AERO-2700001",
    ahuNo: "AHU-1",
    topic: "tmsig-1/1",
    owner: "aero"
  },

];

const userAccess = {
  nemli: ["aero", "perlus"], 
  aksoy: ["aero", "perlus"],
  aero: ["aero"],      
  perlus: ["perlus"],
};

function App() {

  const auth = useAuth();
  const [page, setPage] = useState("project");
  const [selectedProject, setSelectedProject] = useState(null);

  const signOutRedirect = () => {
      const clientId = "132nnak5fjs7880focne3ac7ot";
      const logoutUri = "https://www.akscon.com";
      const cognitoDomain = "eu-central-1igfgickad.auth.eu-central-1.amazoncognito.com";
      localStorage.clear(); 
      sessionStorage.clear();
      const url = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
      
      window.location.href = url;
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
    if (!auth.isAuthenticated || !auth.user?.profile) return [];

    const profile = auth.user.profile;
    const userName = profile["cognito:username"];
    
    const allowedOwners = userAccess[userName] || [];

    return userName === "nemli"
      ? projects
      : projects.filter(p => allowedOwners.includes(p.owner));

  }, [auth.isAuthenticated, auth.user, projects]);

  const userName = useMemo(() => {
    return auth.user?.profile?.["cognito:username"];
  }, [auth.user]);


  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div> --- SİTENİN BAŞINA WWW. KOYARAK GİRİŞ YAPIN --- Encountering error... {auth.error.message}</div>;
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