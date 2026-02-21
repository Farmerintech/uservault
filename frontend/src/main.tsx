import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router"
import { SignUp } from './pages/signup'
import { Login } from './pages/signin'
import Home from './pages/Home'
import { OTPVerification } from './pages/otp'
import { ForgetPassword } from './pages/foregetPassword'
import { ResetPassword } from './pages/resetPassword'
import {MainPage} from './pages/mainPage'
import { AddFile } from './pages/addFile'
import { UserProvider } from './context/provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/confirm_email" element={<OTPVerification />} />
       <Route path="/forgot_password" element={<ForgetPassword />} />
      <Route path="/reset_password" element={<ResetPassword />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/user/dashboard" element={<MainPage />} />
            <Route path="/user/ad_file" element={<AddFile />} />
      {/* <Route path="/dashboard" element={<DashMenu />} /> */}
    </Routes>
  </BrowserRouter>  
</UserProvider>
  </StrictMode>,
)
