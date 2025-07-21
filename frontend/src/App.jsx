import React from 'react'
import { Routes, Route  } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/Login.jsx'
import EmailVerify from './pages/EmailVerify.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserManager from './pages/UserManager.jsx'
import { useContext } from 'react';
import { AppContent } from './context/AppContext';

const App = () => {
  const { isLoggedin } = useContext(AppContent);
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/Reset-password' element={<ResetPassword/>}/>
        {isLoggedin && <Route path='/UserManager' element={<UserManager />} />}
        {!isLoggedin && <Route path='/UserManager' element={<Login />} />}
      </Routes>
    </div>
  )
}

export default App
