import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Dashboard from "./components/Dashboard";
import EmailEditor from "./components/EmailEditor";
import {Routes, Route} from 'react-router-dom';

function App() { 
  return (
    <div className="App">
      <header className="App-header">
        React Custom Media Library Using React Email Editor (Drag & Drop)
      </header>
      <Routes>
      <Route path="/" element={ <Dashboard/> } /> 
      <Route path="/EmailEditor" element={ <EmailEditor/> } />
      </Routes>
   
    </div>
  );
}

export default App;
