import React from 'react'
import { BrowserRouter, Routes , Route, Navigate } from 'react-router-dom' // components and package
import {Button}  from '@/components/ui/button' //we imported this from components
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
const App = () => {
  return (
        /*in react we write sabkuch(page ui-card,button,form) in div */
    <BrowserRouter>
      <Routes>
        < Route path="/auth" element={<Auth/>} />
        < Route path="/chat" element={<Chat/>} />
        < Route path="/profile" element={<Profile/>} />
        < Route path="*" element={<Navigate to="/auth"/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App 
