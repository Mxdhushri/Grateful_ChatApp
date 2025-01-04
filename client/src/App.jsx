import React, { Children, useEffect, useState } from 'react'
import { BrowserRouter, Routes , Route, Navigate } from 'react-router-dom' // components from package
import {Button}  from '@/components/ui/button' //we imported this from components
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'
import Meeting from './components/Meeting'
import Room from './components/Room'
import Pay from './components/Pay'
import OTPVerification from './components/OTPVerification'


const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" />:children;
}

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading]= useState(true)
  //when the value of entities changes this function id executed

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {withCredentials:true})
        if(response.status == 200 && response.data.id){
          setUserInfo(response.data)
        }
        else{
          setUserInfo(undefined)
        } 
        console.log({response});
      } catch(error){
        setUserInfo(undefined)
      }finally {
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData()
    }else{
      setLoading(false);
    }
  },[userInfo, setUserInfo])

  if(loading){
    return <div>
      Loading...
      </div>
  }

  return (
        /*in react we write sabkuch(page ui-card,button,form) in div */
    <BrowserRouter>
      <Routes>
        < Route path="/auth" element={<Auth/>} />
        <Route path="/verifyotp" element={<OTPVerification />} />
        < Route path="/chat" element={<PrivateRoute> <Chat/> </PrivateRoute>} />
        < Route path="/profile" element={<PrivateRoute> <Profile/> </PrivateRoute>} />
        <Route path="/meeting" element={<PrivateRoute> <Meeting /> </PrivateRoute>} />
        <Route path="/pay" element={<PrivateRoute> <Pay /> </PrivateRoute>} />  {/* jo banaya hai na, vo import */}
        <Route path="/room/:roomId" element={<PrivateRoute> <Room/> </PrivateRoute>} />
        < Route path="*" element={<Navigate to="/auth"/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App 
