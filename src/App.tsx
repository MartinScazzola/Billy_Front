// import { useState } from 'react'

// import './App.css'
// import appFirebase from '../src/credentials'
// import {getAuth, onAuthStateChanged} from 'firebase/auth'

// const auth = getAuth(appFirebase)

// import Login from './components/Login'
// import Home from './components/Home'
// import Signup from './components/Signup'

// function App() {

//   const [usuario, setUsuario] = useState(null)

//   onAuthStateChanged(auth, (usuarioFirebase) => {
//     if(usuarioFirebase){
//       setUsuario(usuarioFirebase)
//     } else {
//       setUsuario(null)
//     }
//   })

//   return (
//     // <div>
//     //   {usuario ? <Home correoUsuario = {usuario.email}/> : <Login/>}

//     // </div>
//     <Login/>
//   )
// }

// export default App

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/billy/login" />} />
      <Route path="/billy/login" element={<Login />} />
      <Route path="/billy/signup" element={<Signup />} />
      <Route path="/billy/home" element={<Home />} />
    </Routes>
  );
};

export default App;
