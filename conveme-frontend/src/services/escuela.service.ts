import { convemeApi } from '../api/convemeApi';

// 1. Obtener todas las escuelas para la tabla
export const getEscuelas = async () => {
    const query = `
    query {
        escuelas {
            id_escuela
            nombre
            siglas
            activa
            municipio {
                nombre
                estado {
                    nombre
                }
            }
        }
    }
    `;
    const { data } = await convemeApi.post('', { query });
    if (data.errors) throw new Error(data.errors[0].message);
    return data.data.escuelas;
};

// 2. Crear una nueva escuela desde el Modal
export const createEscuela = async (input: { nombre: string; siglas: string; municipio_id: number }) => {
    const query = `
    mutation CreateEscuela($input: CreateEscuelaInput!) {
        createEscuela(createEscuelaInput: $input) {
            id_escuela
            nombre
        }
    }
    `;
    const { data } = await convemeApi.post('', {
        query,
        variables: { input },
    });

    if (data.errors) throw new Error(data.errors[0].message);
    return data.data.createEscuela;
};
