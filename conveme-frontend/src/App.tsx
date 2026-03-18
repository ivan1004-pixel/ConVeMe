import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import DashboardHome from './pages/DashboardHome';
import Profile from './pages/Profile';
import Catalogos from './pages/Catalogos';
import { AdminRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/ui/DashboardLayout';

function App() {
  return (
    <Routes>
    {/* 🌍 Rutas Públicas */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    {/* 🛡️ Rutas Protegidas (Requieren Token) */}
    <Route element={<AdminRoute />}>
    {/* 🏗️ Todo lo que esté aquí adentro vivirá dentro del Sidebar */}
    <Route element={<DashboardLayout />}>

    <Route path="/dashboard" element={<DashboardHome />} />
    <Route path="/perfil" element={<Profile />} />
    <Route path="/crear-usuario" element={<CreateUser />} />

    {/* Si escribes una URL rara, te regresa al inicio */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    <Route path="/catalogos" element={<Catalogos />} />

    </Route>
    </Route>
    </Routes>
  );
}

export default App;
