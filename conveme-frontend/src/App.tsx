import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import DashboardHome from './pages/DashboardHome';
import Profile from './pages/Profile';
import Catalogos from './pages/Catalogos';
import Inventario from './pages/Inventario';
import POS from './pages/POS'; // 👈 Añadimos la pantalla de ventas
import { AdminRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/ui/DashboardLayout';
import PedidosAdmin from './pages/PedidosAdmin';

// Y adentro de tu <Route element={<DashboardLayout />}> agrega:

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
    <Route path="/pedidos-admin" element={<PedidosAdmin />} />

    {/* Tus Módulos Principales */}
    <Route path="/catalogos" element={<Catalogos />} />
    <Route path="/inventario" element={<Inventario />} />
    <Route path="/pos" element={<POS />} /> {/* 👈 Aquí está el Punto de Venta */}

    {/* Si escribes una URL rara, te regresa al inicio (Siempre va al final) */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
    </Route>
    </Routes>
  );
}

export default App;
