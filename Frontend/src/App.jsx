import FloatingShape from "./components/FloatingShape"
import SignUp from './Pages/SignUp'
import Login from "./Pages/Login" 
import {Navigate, Route, Routes} from "react-router-dom";
import EmailVerification from "./Pages/EmailVerification";
import {Toaster} from 'react-hot-toast';
import { useAuthStore } from "./Store/authStore";
import { useEffect } from "react";
import Home from "./Pages/Home";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPasswordPage from "./Pages/ResetPasswordPage";


const ProtectedRoute = ({children}) => {
  const { isAuthenticated, user } = useAuthStore(); 

  if(!isAuthenticated){
    return <Navigate to = "/login" replace /> 
  }

  if(!user.isVerified){
    return <Navigate to = "/verify-email" replace /> 
  }

  return children ;
}

const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore(); 

  if(isAuthenticated && user.isVerified){
    return <Navigate to = "/" replace /> 
  }

  return children;
}

function App() {

  const {isCheckingAuth, checkAuth} = useAuthStore(); 

  useEffect(() => {
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth) return <LoadingSpinner/>
  // console.log(user);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
        <FloatingShape color = "bg-green-500" size = "w-64 h-64" top = "-5%" left = "10%" delay = {0} /> 
        <FloatingShape color = "bg-green-500" size = "w-48 h-48" top = "70%%" left = "80%" delay = {5} /> 
        <FloatingShape color = "bg-green-500" size = "w-32 h-32" top = "40%" left = "10%" delay = {2} /> 
      
      <Routes>
        <Route path ="/" element = {
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>} /> 

        <Route path ="/signup" element = {
          <RedirectAuthenticatedUser>
            <SignUp/>
          </RedirectAuthenticatedUser>} /> 

        <Route path ="/login" element = {
          <RedirectAuthenticatedUser>
          <Login/>
          </RedirectAuthenticatedUser>} /> 

        <Route path = "/verify-email" element = {<EmailVerification/>} />
        
        <Route path = "/forgot-password" element = {
          <RedirectAuthenticatedUser>
            <ForgotPassword/>
            </RedirectAuthenticatedUser>
        } />

        <Route
          path = '/reset-password/:token'
          element = {
            <RedirectAuthenticatedUser>
              <ResetPasswordPage/>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path = '/*'
          element = {
            <Navigate to='/' replace />
          }
        />

      </Routes>
      <Toaster/>
      </div>
    </>
  )
}

export default App
