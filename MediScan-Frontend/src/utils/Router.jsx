import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import Home from '../components/Home'
import About from '../components/About'
import Symptomcheck from '../components/Symptomcheck'
import Report from '../components/Report'
import Userreports from '../components/Userreports'

function Router() {
  return (
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/symptom-check" element={<Symptomcheck/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/reports" element={<Report/>}/>
        <Route path="/allreports" element={<Userreports/>}/>
    </Routes>
  )
}

export default Router