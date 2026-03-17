import { useState } from 'react';
import { loginService } from '../services/auth.service';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState(false);

    const iniciarSesion = async (username: string, password_raw: string) => {
        setLoading(true);
        setError(null);

        try {

            const response = await loginService(username, password_raw);


            localStorage.setItem('token', response.token);

            setExito(true);
            return true;

        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.errors) {
                setError(err.response.data.errors[0].message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Credenciales incorrectas o error de conexión');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, exito, iniciarSesion };
};
