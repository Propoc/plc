import React, { useEffect, useState , useRef} from "react";
import Dashboard from "./Dashboard";
import Project from "./Project";
import { useAuth } from "react-oidc-context";




function App() {

  const auth = useAuth();
  const [page, setPage] = useState("project");
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
        name: "abc-nike-1",
        projectNo: "MEA-2026-01-010",
        deviceNo: "AERO-2600038",
        ahuNo: "AHU-1",
        mac: "00:00:00:01",
        topic : "tmsig-1/1"
    },
    {
        name: "abc-nike-2",
        projectNo: "MEA-2026-01-011",
        deviceNo: "AERO-2600039",
        ahuNo: "AHU-2",
        mac: "00:00:00:02",
        topic : "tmsig-1/2"
    },
    {
        name: "abc-nike-3",
        projectNo: "MEA-2026-01-012",
        deviceNo: "AERO-2600040",
        ahuNo: "AHU-3",
        mac: "00:00:00:03"
    },
    {
        name: "xyz-ford-1",
        projectNo: "MEA-2026-02-001",
        deviceNo: "AERO-2700001",
        ahuNo: "AHU-1",
        mac: "00:00:00:04"
    },
    {
        name: "lmn-bmw-1",
        projectNo: "MEA-2026-03-001",
        deviceNo: "AERO-2800001",
        ahuNo: "AHU-1",
        mac: "00:00:00:05"
    }

  ];



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

    const userName = auth.user.attributes.name;
    const visibleProjects =
    userName === "all"
        ? projects
        : projects.filter(p => p.name.startsWith(userName));

    return (
      <>
        {page === "project" && <Project setPage={setPage} user={auth.user} visibleProjects = {visibleProjects} setSelectedProject={setSelectedProject}/>}
        {page === "dashboard" && <Dashboard  setPage={setPage} projectTopic={selectedProject.topic}/>}
      </>
    );
  }

}

export default App;