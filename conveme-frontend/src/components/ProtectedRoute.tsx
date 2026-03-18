import { Navigate, Outlet } from 'react-router-dom';

export const AdminRoute = () => {
    const token = localStorage.getItem('token');
    const rolId = localStorage.getItem('rol_id');

    if (!token || rolId !== '1') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
