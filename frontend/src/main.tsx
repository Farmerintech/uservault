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
import { Files } from './pages/files'
import { Profile } from './pages/profile'
import { FaceRegister } from './pages/captureFace'
import { FaceVerify } from './pages/verifyFace'
import { ProtectedRoute } from './components/protectedRoute'

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
      <Route path="/user/biometric" element={<FaceRegister />} /> 
      <Route path="/user/verify_face" element={<FaceVerify />} />

<Route
  path="/user/dashboard"
  element={
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/user/ad_file"
  element={
    <ProtectedRoute>
      <AddFile />
    </ProtectedRoute>
  }
/>

<Route
  path="/user/my_file"
  element={
    <ProtectedRoute>
      <Files />
    </ProtectedRoute>
  }
/>

<Route
  path="/user/my_profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>


      {/* <Route path="/dashboard" element={<DashMenu />} /> */}
    </Routes>
  </BrowserRouter>  
</UserProvider>
  </StrictMode>,
)
