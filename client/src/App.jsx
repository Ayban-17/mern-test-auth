import { Navigate, Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import VerificationPage from "./pages/VerificationPage"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import HomePage from "./pages/HomePage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"

const ProtectedRoutes = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }

  if(user && !user.isVerified){
    return <Navigate to="/verify" replace/>
  }

  return children;
}

const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace/>
  }

  return children
}

function App() {
  const { checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(()=>{
    async function fetchData() {
      await checkAuth()
    }
    fetchData();
  },[checkAuth]);

  if (isCheckingAuth) {
    // Show a loading screen while checking authentication
    return <div>Loading...</div>; // Replace this with any loading spinner or component
  }

  return (
   <main className="h-screen flex justify-center items-center">
    <Routes>
      <Route path="/" element={
        <ProtectedRoutes>
          <HomePage/>
        </ProtectedRoutes>
      }/>
      <Route path="/sign-up" element={
        <RedirectAuthenticatedUser> 
          <SignUpPage/> 
        </RedirectAuthenticatedUser>
      }
      />
      <Route path="/login" element={
        <RedirectAuthenticatedUser> 
          <LoginPage/> 
        </RedirectAuthenticatedUser>
      }/>
      <Route path="/verify" element={<VerificationPage/>}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
    </Routes>
   </main>
  )
}

export default App
