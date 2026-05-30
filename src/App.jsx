import { useState, useContext, useEffect } from 'react'
import './App.css'
import { ThemeContext } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "./css/Users/auth.css"
import "./css/Employers/auth.css"

import "./css/Components/Footer.css"
import "./css/Components/Navbar.css"
import "./css/Components/ErrorPage.css"
import "./css/Components/FloatingActionButton.css"


import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';

import Error404 from './components/error/Error404';
// import FloatingActionButton from './components/layout/floatingActionButtion';

import UserSigup from './pages/users/auth/signup'
import UserLogin from './pages/users/auth/login'
import UserForgotPassword from './pages/users/auth/forgotPassword'
import UserVerify from './pages/users/auth/verify'



function App() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
                <div className={isDarkMode ? 'dark' : 'light'}>
         <Router>

 {/* {token1 ? <AdminNavbar /> : <Navbar />} */}
          {/* <AdminSidebar /> */}

         <Navbar />
          {/* <FloatingActionButton /> */}

          {/* <AdminNavSidebar /> */}
          <Routes>
            {/* <Route path="/" element={<Homepage />} /> */}
            <Route path="/user/auth/signup" element={<UserSigup />} />
            <Route path="/user/auth/login" element={<UserLogin />} />
            <Route path="/user/auth/forgot-password" element={<UserForgotPassword />} />
            <Route path="/user/auth/verify" element={<UserVerify />} />
            


            


            <Route path="*" element={<Error404 />} />
          </Routes>

          <Footer />
        </Router>
      </div>
    </>
  )
}

export default App
