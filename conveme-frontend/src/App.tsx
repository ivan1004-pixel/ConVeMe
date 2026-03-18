import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import { AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    {/* Rutas Protegidas solo para Administradores */}
    <Route element={<AdminRoute />}>
    <Route path="/crear-usuario" element={<CreateUser />} />
    {/* Aquí irá el Dashboard después */}
    </Route>
    </Routes>
  );
}

export default App;
