import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router"
import { SignUp } from './pages/signup'
import { DashMenu } from './components/dash-menu'
import { Dashboard } from './pages/dashboard'
import { Login } from './pages/signin'
import Home from './pages/Home'
import { OTPVerification } from './pages/otp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm_email" element={<OTPVerification />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/dashbaord" element={<Dashboard />} />
      <Route path="/dashboard" element={<DashMenu />} />
    </Routes>
  </BrowserRouter>  

  </StrictMode>,
)
