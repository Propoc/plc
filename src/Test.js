import React, { useEffect, useState , useRef, useMemo} from "react";
import Dashboard from "./Dashboard";
import Project from "./Project";

  const projects = [
    {   
        name: "perlus-nike-1",
        projectNo: "MEA-2026-01-010",
        deviceNo: "AERO-2600038",
        ahuNo: "AHU-1",
        mac: "00:00:00:01",
        topic : "tmsig-1/1"
    },
    {
        name: "perlus-nike-2",
        projectNo: "MEA-2026-01-011",
        deviceNo: "AERO-2600039",
        ahuNo: "AHU-2",
        mac: "00:00:00:02",
        topic : "tmsig-1/2"
    },
    {
        name: "perlus-nike-3",
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



function Test() {

  const [page, setPage] = useState("project");
  const [selectedProject, setSelectedProject] = useState(null);
  const userName = "NEMLİ";

  
    return (
      <>
        {page === "project" && <Project setPage={setPage} user={userName} visibleProjects = {projects} setSelectedProject={setSelectedProject} />}
        {page === "dashboard" && <Dashboard  setPage={setPage} project={selectedProject} user={userName}/>}
      </>
    );


}

export default Test;