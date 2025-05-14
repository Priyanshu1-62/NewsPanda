import './App.css';

import React, { useState, useRef } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';
import About from './Components/About';
import { HashRouter, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const myAPI=process.env.REACT_APP_API1;

const App = () => {
  const [progress, setProgress]=useState(0);
  const pageSizeRef=useRef(9);
  
    return (
      <>
      <HashRouter>
        <Navbar/>
        <LoadingBar
          color="#f11946"
          height={3}
          progress={progress}
        />
        <Routes>
          <Route path="/" element={<News setProgress={setProgress} key="k1" APIkey={myAPI} pageSize={pageSizeRef.current} category="general" country="us"/>}/>
          <Route path="/science" element={<News setProgress={setProgress} key="k3" APIkey={myAPI} pageSize={pageSizeRef.current} category="science" country="us"/>}/>
          <Route path="/business" element={<News setProgress={setProgress} key="k4" APIkey={myAPI} pageSize={pageSizeRef.current} category="business" country="us"/>}/>
          <Route path="/entertainment" element={<News setProgress={setProgress} key="k5" APIkey={myAPI} pageSize={pageSizeRef.current} category="entertainment" country="us"/>}/>
          <Route path="/health" element={<News setProgress={setProgress} key="k6"APIkey={myAPI} pageSize={pageSizeRef.current} category="health" country="us"/>}/>
          <Route path="/sports" element={<News setProgress={setProgress} key="k7" APIkey={myAPI} pageSize={pageSizeRef.current} category="sports" country="us"/>}/>
          <Route path="/technology" element={<News setProgress={setProgress} key="k8" APIkey={myAPI} pageSize={pageSizeRef.current} category="technology" country="us"/>}/>
        </Routes>
      </HashRouter>
      </>
    )
}
export default App;
