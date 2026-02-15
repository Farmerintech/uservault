import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router"
import { SignUp } from './pages/signup'
import { DashMenu } from './components/dash-menu'
import { Dashboard } from './pages/dashboard'
import { Login } from './pages/signin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<DashMenu />} />
    </Routes>
  </BrowserRouter>  

  </StrictMode>,
)
