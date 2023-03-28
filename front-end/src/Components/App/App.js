import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Profile from '../Profile/Profile';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const setAuth = (boolean) => {
    setIsAuth(boolean);
  }

  useEffect(() => {
    const token = document.cookie.slice(6, -8);
    if (!token) {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={!isAuth ? <Login setAuth={setAuth} isAuth={isAuth} /> : <Navigate to='/profile' />} />
      <Route path='/signup' element={<SignUp isAuth={isAuth} />} />
      <Route path='/profile' element={!isAuth ? <Navigate to='/login' /> : <Profile setAuth={setAuth} isAuth={isAuth} />} />
    </Routes>
  )
}

export default App;


