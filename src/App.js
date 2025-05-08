import './App.css';

import React, { Component } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';
import About from './Components/About';
import { HashRouter, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const myAPI=process.env.REACT_APP_API2;

export default class App extends Component {
  state={
    progress: 0
  }
  setProgress = (progress) =>{
    this.setState({progress: progress});
  }
  pageSize=9;
  render() {
    return (
      <>
      <HashRouter>
        <Navbar/>
        <LoadingBar
          color="#f11946"
          height={3}
          progress={this.state.progress}
        />
        <div>
          
        </div>
        <Routes>
          <Route path="/" element={<News setProgress={this.setProgress} key="k1" APIkey={myAPI} pageSize={this.pageSize} category="general"/>}/>
          <Route path="/general" element={<News setProgress={this.setProgress} key="k2" APIkey={myAPI} pageSize={this.pageSize} category="general"/>}/>
          <Route path="/science" element={<News setProgress={this.setProgress} key="k3" APIkey={myAPI} pageSize={this.pageSize} category="science"/>}/>
          <Route path="/business" element={<News setProgress={this.setProgress} key="k4" APIkey={myAPI} pageSize={this.pageSize} category="business"/>}/>
          <Route path="/entertainment" element={<News setProgress={this.setProgress} key="k5" APIkey={myAPI} pageSize={this.pageSize} category="entertainment"/>}/>
          <Route path="/health" element={<News setProgress={this.setProgress} key="k6"APIkey={myAPI} pageSize={this.pageSize} category="health"/>}/>
          <Route path="/sports" element={<News setProgress={this.setProgress} key="k7" APIkey={myAPI} pageSize={this.pageSize} category="sports"/>}/>
          <Route path="/technology" element={<News setProgress={this.setProgress} key="k8" APIkey={myAPI} pageSize={this.pageSize} category="technology"/>}/>
          <Route path="/about" element={<About/>}/>
        </Routes>
      </HashRouter>
      </>
    )
  }
}
