import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import GroupPage from './components/GroupPage';

// App component
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/billy/login" />} />
      <Route path="/billy/login" element={<Login />} />
      <Route path="/billy/signup" element={<Signup />} />
      <Route path="/billy/home" element={<Home />} />
      <Route path="/billy/group/:groupid" element={<GroupPage />} /> {/* Ruta para la página de cada grupo */}
    </Routes>
  );
};

export default App;
