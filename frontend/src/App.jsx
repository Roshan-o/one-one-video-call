import React from "react"
import { Route, Routes } from "react-router-dom"
// import './App.css'
import LandingPage from "./Pages/LandingPage"
import Room from "./Pages/Room"
function App() {


  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/room" element={<Room/>} /> */}
      <Route path="/room/:roomid" element={<Room/>} />
      </Routes>
  )
}

export default App
