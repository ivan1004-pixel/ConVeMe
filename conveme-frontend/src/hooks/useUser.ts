import { useState } from 'react';
import { createUserService } from '../services/user.service';

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState(false);

    const crearUsuario = async (username: string, password_raw: string, rol_id: number) => {
        setLoading(true);
        setError(null);
        setExito(false);

        try {
            await createUserService(username, password_raw, rol_id);
            setExito(true);
            return true;
        } catch (err: any) {
            // Si es un error de Axios (ej. 400 Bad Request)
            if (err.response && err.response.data && err.response.data.errors) {
                alert("⚠️ EL BACKEND DICE:\n" + err.response.data.errors[0].message);
            }
            // Si es el error que nosotros lanzamos manualmente en el servicio
            else if (err.message) {
                alert("⚠️ EL BACKEND DICE:\n" + err.message);
            }
            else {
                console.error("Fallo al contactar al backend:", err);
            }

            setError('Error al crear el usuario. Revisa la consola.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, exito, crearUsuario, setExito };
};
