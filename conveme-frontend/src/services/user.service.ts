import { convemeApi } from '../api/convemeApi';

export const createUserService = async (username: string, password_raw: string, rol_id: number) => {
    const query = `
    mutation CreateUsuario($username: String!, $password_raw: String!, $rol_id: Int!) {
        createUsuario(createUsuarioInput: {
            username: $username,
            password_raw: $password_raw,
            rol_id: $rol_id
        }) {
            id_usuario
            username
        }
    }
    `;

    const { data } = await convemeApi.post('', {
        query,
        variables: { username, password_raw, rol_id },
    });

    if (data.errors) throw new Error(data.errors[0].message);
    return data.data.createUsuario;
};
