import React from 'react'
import { Routes, Route  } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import EmailVerify from './pages/emailverify.jsx'
import ResetPassword from './pages/resetpassword.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/email-verify" element={<EmailVerify/>}/>
        <Route path="/Reset-password" element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App
