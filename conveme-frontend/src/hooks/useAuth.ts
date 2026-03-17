import { useState } from 'react';
import { loginService } from '../services/auth.service';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState(false);

    const iniciarSesion = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            // Usamos Axios (simulado por ahora hasta que conectemos el backend de Auth real)
            // const response = await loginService(username, password);
            // localStorage.setItem('token', response.access_token);

            // SIMULACIÓN PARA QUE VEAS TU ANIMACIÓN
            await new Promise(resolve => setTimeout(resolve, 1500));
            setExito(true);
            return true; // Retorna true si fue exitoso

        } catch (err) {
            setError('Credenciales incorrectas o error de servidor');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        exito,
        iniciarSesion
    };
};
