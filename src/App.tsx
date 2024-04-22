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
