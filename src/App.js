import React, { useEffect, useState , useRef} from "react";
import Dashboard from "./Dashboard";
import Project from "./Project";
import { useAuth } from "react-oidc-context";




function App() {
  const [page, setPage] = useState("project");

  return (
    <>
      {page === "project" && <Project setPage={setPage} />}
      {page === "dashboard" && <Dashboard  setPage={setPage}/>}
    </>
  );
}

export default App;